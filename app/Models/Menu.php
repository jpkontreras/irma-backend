<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Menu extends Model
{
    use HasFactory, HasUlids;

    protected $fillable = ["user_id", "name", "description"];

    public function items()
    {
        return $this->hasMany(MenuItem::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }


    public function labels()
    {
        return $this->belongsToMany(Label::class, 'label_menu');
    }
}
