<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Restaurant;
use App\Jobs\ProcessMenuFiles;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Bus;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Cache;

class MenuDigitalizationController extends Controller
{
  public function create(Restaurant $restaurant)
  {
    return Inertia::render('Menus/Digitalize/Create', [
      'restaurant' => $restaurant,
    ]);
  }

  public function store(Request $request, Restaurant $restaurant): Response
  {
    try {
      $request->validate([
        'menu_files' => 'required|array',
        'menu_files.*' => [
          'required',
          'file',
          'max:4096', // 4MB
          'mimes:png,jpg,jpeg,gif,webp' // Remove PDF and Excel formats
        ]
      ], [
        'menu_files.required' => __('messages.menu_files_required'),
        'menu_files.array' => __('messages.menu_files_must_be_array'),
        'menu_files.*.required' => __('messages.each_file_required'),
        'menu_files.*.file' => __('messages.must_be_valid_file'),
        'menu_files.*.max' => __('messages.file_too_large'),
        'menu_files.*.mimes' => __('messages.invalid_file_type'),
      ]);

      $files = $request->file('menu_files');
      $storedFiles = [];

      foreach ($files as $file) {
        $path = $file->store('menu-uploads', 'public');
        $storedFiles[] = [
          'path' => $path,
          'name' => $file->getClientOriginalName(),
          'type' => $file->getMimeType(),
        ];
      }

      // Create a batch with a single job
      $batch = Bus::batch([
        new ProcessMenuFiles((int) $restaurant->id, $storedFiles)
      ])->dispatch();

      return Inertia::location(route('restaurants.menus.digitalize.processing', [
        'restaurant' => $restaurant->id,
        'batch' => $batch->id,
      ]));
    } catch (\Exception $e) {
      Log::error('Menu digitalization error:', [
        'message' => $e->getMessage(),
        'restaurant_id' => $restaurant->id
      ]);

      return response()->json([
        'message' => __('messages.file_processing_error'),
        'errors' => ['menu_files' => __('messages.file_processing_error')]
      ], 422);
    }
  }

  public function processing(Restaurant $restaurant, string $batchId)
  {
    $batch = Bus::findBatch($batchId);

    if (!$batch) {
      abort(404);
    }

    return Inertia::render('Menus/Digitalize/Processing', [
      'restaurant' => $restaurant,
      'batch' => [
        'id' => $batch->id,
        'progress' => $batch->progress(),
        'finished' => $batch->finished(),
        'cancelled' => $batch->cancelled(),
        'pendingJobs' => $batch->pendingJobs,
        'failedJobs' => $batch->failedJobs,
        'totalJobs' => $batch->totalJobs,
      ],
    ]);
  }

  public function status(Restaurant $restaurant, string $batchId)
  {
    return response()->stream(function () use ($batchId) {
      try {
        $batch = Bus::findBatch($batchId);

        if (!$batch) {
          echo "event: error\n";
          echo "data: " . json_encode(['error' => 'Batch not found']) . "\n\n";
          ob_flush();
          flush();
          return;
        }

        $cacheKey = "menu_digitalization_{$batchId}";

        while (true) {
          try {
            $currentData = Cache::get($cacheKey, [
              'status' => 'waiting',
              'total_files' => 0,
              'processed_files' => 0,
              'files' => [],
            ]);

            $data = [
              'id' => $batch->id,
              'progress' => $batch->progress(),
              'finished' => $batch->finished(),
              'cancelled' => $batch->cancelled(),
              'pendingJobs' => $batch->pendingJobs,
              'failedJobs' => $batch->failedJobs,
              'totalJobs' => $batch->totalJobs,
              'data' => $currentData,
            ];

            // Log the data being sent
            Log::debug('Sending SSE data:', $data);

            // Properly format SSE data with explicit event and data fields
            echo "event: message\n";
            echo "data: " . json_encode($data) . "\n\n";

            // Ensure output is flushed
            if (ob_get_level() > 0) {
              ob_end_flush();
            }
            flush();

            if ($currentData['status'] === 'completed' || $batch->cancelled() || $batch->finished()) {
              Log::info('Stream ended:', [
                'status' => $currentData['status'],
                'cancelled' => $batch->cancelled(),
                'finished' => $batch->finished()
              ]);
              break;
            }

            // Add a delay between updates
            sleep(1);
          } catch (\Exception $e) {
            Log::error('Error in stream loop:', [
              'error' => $e->getMessage(),
              'trace' => $e->getTraceAsString()
            ]);
            echo "event: error\n";
            echo "data: " . json_encode([
              'error' => 'Stream error',
              'message' => $e->getMessage()
            ]) . "\n\n";
            break;
          }
        }
      } catch (\Exception $e) {
        Log::error('Fatal stream error:', [
          'error' => $e->getMessage(),
          'trace' => $e->getTraceAsString()
        ]);
        echo "event: error\n";
        echo "data: " . json_encode([
          'error' => 'Fatal stream error',
          'message' => $e->getMessage()
        ]) . "\n\n";
      }
    }, 200, [
      'Cache-Control' => 'no-cache',
      'Content-Type' => 'text/event-stream',
      'X-Accel-Buffering' => 'no',
      'Connection' => 'keep-alive',
    ]);
  }
}
