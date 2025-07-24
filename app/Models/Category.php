<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    /** @use HasFactory<\Database\Factories\CategoryFactory> */
    use HasFactory, HasUuids;

    protected $fillable = [
        'name',
        'short_description'
    ];

    public function disease()
    {
        return $this->hasMany(Disease::class);
    }

    public function health_case()
    {
        return $this->hasMany(HealthCase::class);
    }
}
