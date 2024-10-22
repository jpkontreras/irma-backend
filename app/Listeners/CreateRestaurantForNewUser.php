<?php

namespace App\Listeners;

use App\Models\Restaurant;
use Illuminate\Auth\Events\Registered;

class CreateRestaurantForNewUser
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(Registered $event): void
    {
        $user = $event->user;

        Restaurant::create([
            'name' => $user->name . "'s Restaurant",
            'user_id' => $user->id,
        ]);
    }
}
