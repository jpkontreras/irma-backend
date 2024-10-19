<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Restaurant;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Event;
use Illuminate\Auth\Events\Registered;
use Tests\TestCase;

uses(RefreshDatabase::class);

test('new users can register', function () {
    $response = $this->post('/register', [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $response->assertRedirect(route('dashboard'));
    $this->assertAuthenticated();

    $this->assertDatabaseHas('users', [
        'name' => 'Test User',
        'email' => 'test@example.com',
    ]);

    $user = User::where('email', 'test@example.com')->first();
    expect($user)->not->toBeNull();

    $this->assertDatabaseHas('restaurants', [
        'name' => "Test User's Restaurant",
        'user_id' => $user->id,
    ]);
});

test('new users cannot register with invalid data', function () {
    $response = $this->post('/register', [
        'name' => '',
        'email' => 'not-an-email',
        'password' => 'short',
        'password_confirmation' => 'different',
    ]);

    $response->assertSessionHasErrors(['name', 'email', 'password']);
    $this->assertGuest();
});

test('registered user has restaurant created', function () {
    // Don't fake the event, we want it to actually run
    $response = $this->post('/register', [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $response->assertRedirect(route('dashboard'));

    $user = User::where('email', 'test@example.com')->first();
    expect($user)->not->toBeNull();

    $this->assertDatabaseHas('restaurants', [
        'name' => $user->name . "'s Restaurant",
        'user_id' => $user->id,
    ]);

    $restaurant = Restaurant::where('user_id', $user->id)->first();
    expect($restaurant)->not->toBeNull();
    expect($restaurant->name)->toBe($user->name . "'s Restaurant");
});
