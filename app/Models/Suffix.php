<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Models\Activity;

class Suffix extends Model
{
    /** @use HasFactory<\Database\Factories\SuffixFactory> */
    use HasFactory, HasUuids, LogsActivity;

    protected $fillable = [
        'name'
    ];

    public function patient_info()
    {
        return $this->hasMany(PatientInfo::class);
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->useLogName('suffix')
            ->logOnly(['name'])
            ->logOnlyDirty();
    }

    public function getDescriptionForEvent(string $eventName): string
    {
        return "Suffix was {$eventName}";
    }

    public function tapActivity(Activity $activity, string $eventName)
    {
        $activity->properties = $activity->properties->merge([
            'ip' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);
    }
}

