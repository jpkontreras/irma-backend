<?php

namespace App\Http\Middleware\Restaurant;

use App\Models\Category;
use Closure;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

class Share
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {

        $categories = Category::all();
        Inertia::share('categories', $categories);


        return $next($request);
    }
}
