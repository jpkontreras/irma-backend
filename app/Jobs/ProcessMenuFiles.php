<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Bus\Batchable;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;
use OpenAI\Laravel\Facades\OpenAI;


class ProcessMenuFiles implements ShouldQueue
{
  public $timeout = 0;

  use Batchable, Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

  private const SYSTEM_PROMPT = <<<EOT
    You are a menu digitalization expert. Analyze the menu images and extract information in %s language.
    All categories, descriptions and any text should be kept in their original form if they are in %s, 
    otherwise translate them to %s. 

    For each image, evaluate these criteria for the confidence score:
    1. Layout (0-25 points):
       - Clear organization
       - Consistent formatting
       - Menu-like structure
    2. Content (0-25 points):
       - Food/beverage items present
       - Descriptions and prices
       - Restaurant-related terminology
    3. Price Patterns (0-25 points):
       - Consistent price formatting
       - Reasonable price ranges
       - Currency indicators
    4. Visual Elements (0-25 points):
       - Professional formatting
       - Restaurant/food context
       - Menu-specific design elements

    Only assign high scores (80+) if the image is clearly a restaurant menu.
    Scores 60-79: Likely a menu but with issues
    Scores below 60: Not clearly identifiable as a menu

    Format the response as a JSON object with the following structure:
    {
      "categories":[
          {
            "name":"category name",
            "items":[
                {
                  "name":"item name",
                  "description":"item description",
                  "price":"price as number",
                  "tags":[
                      "tag1",
                      "tag2"
                  ],
                  "ingredients":[
                      "ingredient1",
                      "ingredient2"
                  ],
                  "notes":"any special notes"
                }
            ]
          }
      ],
      "currency":"currency symbol or code",
      "additional_info":{
          "dietary_notes":"any general dietary information",
          "other_notes":"any other relevant information"
      },
      "confidence_score":95
    }
    EOT;

  public function __construct(
    private readonly int $restaurantId,
    private readonly array $files,
  ) {}

  private function extractJsonFromResponse(string $content): ?array
  {
    try {
      // Find JSON content between triple backticks
      if (preg_match('/```(?:json)?\s*([\s\S]*?)```/i', $content, $matches)) {
        $jsonString = $matches[1];
      } else {
        // If no backticks, try to find JSON directly
        $jsonString = $content;
      }

      // Clean up the string but preserve special characters
      $jsonString = preg_replace('/\\\\n/', '', $jsonString); // Remove \n
      $jsonString = preg_replace('/\s+/', ' ', $jsonString); // Normalize whitespace
      $jsonString = preg_replace('/\/\/.*\n/', '', $jsonString); // Remove single-line comments
      $jsonString = preg_replace('/\/\*.*?\*\//s', '', $jsonString); // Remove multi-line comments
      $jsonString = preg_replace('/[\x00-\x1F\x7F]/', '', $jsonString); // Remove control characters
      $jsonString = str_replace('\"', '"', $jsonString); // Fix escaped quotes
      $jsonString = preg_replace('/,\s*([\]}])/m', '$1', $jsonString); // Remove trailing commas

      // Parse JSON with UTF-8 encoding
      $data = json_decode($jsonString, true, 512, JSON_INVALID_UTF8_IGNORE | JSON_UNESCAPED_UNICODE);

      if (json_last_error() !== JSON_ERROR_NONE) {
        return null;
      }

      return $data;
    } catch (\Exception $e) {
      return null;
    }
  }

  private function getImageHash(string $filePath): string
  {
    return hash('sha256', file_get_contents($filePath));
  }

  private function getCachedMenuData(string $imageHash): ?array
  {
    $cacheKey = "menu_analysis:{$imageHash}";
    return Cache::get($cacheKey);
  }

  private function cacheMenuData(string $imageHash, array $menuData): void
  {
    $cacheKey = "menu_analysis:{$imageHash}";
    // Cache for 30 days
    Cache::put($cacheKey, $menuData, now()->addDays(30));
  }

  public function handle(): void
  {
    try {
      if ($this->batch()->cancelled()) {
        return;
      }

      $totalFiles = count($this->files);
      $cacheKey = "menu_digitalization_{$this->batch()->id}";
      $appLocale = config('app.locale', 'en');
      $formattedPrompt = sprintf(
        self::SYSTEM_PROMPT,
        $appLocale,
        $appLocale,
        $appLocale
      );

      $currentData = [
        'status' => 'processing',
        'total_files' => $totalFiles,
        'processed_files' => 0,
        'files' => [],
      ];
      Cache::put($cacheKey, $currentData, now()->addHours(1));

      // Process each file individually
      foreach ($this->files as $file) {
        try {
          // Validate file exists and is readable
          if (!Storage::disk('public')->exists($file['path'])) {
            throw new \Exception(json_encode($this->createError('PROC_002')));
          }

          $filePath = Storage::disk('public')->path($file['path']);

          // Validate file size
          if (filesize($filePath) > 10 * 1024 * 1024) { // 10MB limit
            throw new \Exception(json_encode($this->createError('PROC_003')));
          }

          // Validate file type
          $mimeType = mime_content_type($filePath);
          if (!in_array($mimeType, ['image/jpeg', 'image/png', 'image/gif', 'image/webp'])) {
            throw new \Exception(json_encode($this->createError('PROC_004')));
          }

          // Generate hash for the image
          $imageHash = $this->getImageHash($filePath);

          // Check if we have cached results
          $cachedData = $this->getCachedMenuData($imageHash);

          if ($cachedData) {
            // Use cached data instead of processing again
            $menuData = $cachedData;
            $confidenceScore = $menuData['confidence_score'] ?? 0;
            $isLikelyMenu = $confidenceScore >= 70;

            Log::info('Using cached menu analysis', [
              'image_hash' => $imageHash,
              'restaurant_id' => $this->restaurantId
            ]);
          } else {
            // Process single image with OpenAI
            $messages = [
              [
                'role' => 'system',
                'content' => $formattedPrompt
              ],
              [
                'role' => 'user',
                'content' => [
                  [
                    'type' => 'text',
                    'text' => 'Analyze this menu image and extract all relevant information.'
                  ],
                  [
                    'type' => 'image_url',
                    'image_url' => [
                      'url' => "data:image/jpeg;base64," . base64_encode(file_get_contents($filePath))
                    ]
                  ]
                ]
              ]
            ];

            try {
              $response = OpenAI::chat()->create([
                'model' => 'gpt-4o-mini',
                'messages' => $messages,
              ]);
            } catch (\Exception $e) {
              throw new \Exception(json_encode($this->createError('AI_001', $e->getMessage())));
            }

            $menuData = $this->extractJsonFromResponse($response->choices[0]->message->content);

            if (!$menuData) {
              throw new \Exception(json_encode($this->createError('VAL_001')));
            }

            // Cache the results for future use
            $this->cacheMenuData($imageHash, $menuData);

            $confidenceScore = $menuData['confidence_score'] ?? 0;
            $isLikelyMenu = $confidenceScore >= 70;
          }

          // Validate menu structure
          if (!isset($menuData['categories']) || empty($menuData['categories'])) {
            throw new \Exception(json_encode($this->createError('VAL_002')));
          }

          if (!$isLikelyMenu) {
            $currentData['files'][] = [
              'name' => $file['name'],
              'status' => 'completed',
              'error' => $this->createError('AI_002'),
              'results' => [
                'detected_items' => $this->countItems($menuData),
                'confidence_score' => $confidenceScore,
                'is_likely_menu' => false,
                'menu_data' => $menuData,
                'sample_items' => $this->getSampleItems($menuData),
              ],
            ];
          } else {
            $currentData['files'][] = [
              'name' => $file['name'],
              'status' => 'completed',
              'results' => [
                'detected_items' => $this->countItems($menuData),
                'confidence_score' => $confidenceScore,
                'is_likely_menu' => true,
                'menu_data' => $menuData,
                'sample_items' => $this->getSampleItems($menuData),
              ],
            ];
          }

          $currentData['processed_files']++;
          Cache::put($cacheKey, $currentData, now()->addHours(1));
        } catch (\Exception $e) {
          $currentData['files'][] = [
            'name' => $file['name'],
            'status' => 'failed',
            'error' => is_array(json_decode($e->getMessage(), true))
              ? json_decode($e->getMessage(), true)
              : $this->createError('SYS_003', $e->getMessage())
          ];
          $currentData['processed_files']++;
          Cache::put($cacheKey, $currentData, now()->addHours(1));
        }
      }

      $currentData['status'] = 'completed';
      $currentData['message'] = __('messages.menu_digitalization_completed');
      Cache::put($cacheKey, $currentData, now()->addHours(1));
    } catch (\Exception $e) {
      $currentData['status'] = 'failed';
      $currentData['error'] = $this->createError('SYS_003', $e->getMessage());
      Cache::put($cacheKey, $currentData, now()->addHours(1));
    }
  }

  private function countItems(?array $menuData): int
  {
    if (!$menuData) {
      return 0;
    }

    $count = 0;
    foreach ($menuData['categories'] ?? [] as $category) {
      $count += count($category['items'] ?? []);
    }
    return $count;
  }

  private function getSampleItems(?array $menuData): array
  {
    if (!$menuData) {
      return [];
    }

    $samples = [];
    foreach ($menuData['categories'] ?? [] as $category) {
      foreach ($category['items'] ?? [] as $item) {
        if (isset($item['name']) && isset($item['price'])) {
          $samples[] = [
            'name' => $item['name'],
            'price' => $item['price']
          ];
          if (count($samples) >= 2) break 2;
        }
      }
    }
    return $samples;
  }

  private function createError(string $code, ?string $additionalInfo = null): array
  {
    $errorCode = strtolower($code);
    $error = [
      'code' => $code,
      'title' => __('messages.error_processing_menu'),
      'message' => __("messages.error_{$errorCode}"),
      'details' => __("messages.error_{$errorCode}_details"),
      'suggestion' => __("messages.error_{$errorCode}_suggestion"),
    ];

    if ($additionalInfo) {
      $error['additional_info'] = $additionalInfo;
    }

    return $error;
  }
}
