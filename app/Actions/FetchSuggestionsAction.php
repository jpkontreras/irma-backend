<?php

declare(strict_types=1);

namespace App\Actions;

use Illuminate\Support\Facades\Http;

class FetchSuggestionsAction
{
  public function execute(string $query): array
  {
    $response = Http::get('https://cookpad.com/cl/suggestions.json', [
      'q' => $query,
    ]);

    if ($response->successful()) {
      $suggestions = $response->json('suggestions', []);
      $filteredSuggestions = array_filter($suggestions, function ($suggestion) {
        return isset($suggestion['data']['clickLog']['params']['position']);
      });
      $mappedSuggestions = array_map(function ($suggestion) {
        return [
          'value' => $suggestion['value'],
          'position' => $suggestion['data']['clickLog']['params']['position'],
        ];
      }, $filteredSuggestions);
      usort($mappedSuggestions, function ($a, $b) {
        return $a['position'] <=> $b['position'];
      });
      return $mappedSuggestions; // Return all filtered suggestions
    }

    return [];
  }
}
