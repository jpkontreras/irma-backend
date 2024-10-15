<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Menu extends Model
{
    use HasFactory, HasUlids;

    /**MENU_CREATION_TYPE */
    const REGULAR = 1;
    const OCR = 2;
    const TEMPLATE = 3;

    protected $fillable = ['restaurant_id', 'name', 'description', 'type'];

    public function restaurant()
    {
        return $this->belongsTo(Restaurant::class);
    }

    public function items()
    {
        return $this->hasMany(MenuItem::class);
    }

    public function labels()
    {
        return $this->belongsToMany(Label::class, 'label_menu');
    }
}
