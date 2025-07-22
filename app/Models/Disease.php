<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Disease extends Model
{
    /** @use HasFactory<\Database\Factories\DiseaseFactory> */
    use HasFactory, HasUuids;

    public $fillable = [
        'name',
        'short_description',
        'category_id'
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}
