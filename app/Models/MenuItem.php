<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MenuItem extends Model
{
    use HasFactory, HasUlids;

    protected $fillable = ["name", "price", "currency", "description"];

    public function menu()
    {
        return $this->belongsTo(Menu::class);
    }

    public function labels()
    {
        return $this->belongsToMany(Label::class, 'label_menu_item');
    }
}
