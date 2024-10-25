<?php

namespace App\Http\Controllers;

use App\Actions\FetchSuggestionsAction;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SuggestionController extends Controller
{
  public function __invoke(Request $request, FetchSuggestionsAction $action): JsonResponse
  {
    $query = $request->input('q');
    $suggestions = $action->execute($query);

    return response()->json($suggestions);
  }
}
