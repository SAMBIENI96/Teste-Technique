<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Tutor extends Model
{
    protected $fillable = [
        'first_name', 'photo_url', 'bio', 'years_experience',
        'rating', 'reviews_count', 'lessons_count', 'specialties',
    ];

    protected function casts(): array
    {
        return [
            'rating' => 'float',
            'specialties' => 'array',
        ];
    }

    public function subjects(): BelongsToMany
    {
        return $this->belongsToMany(Subject::class, 'tutor_subject_level')
            ->withPivot('level_id');
    }

    public function levels(): BelongsToMany
    {
        return $this->belongsToMany(Level::class, 'tutor_subject_level')
            ->withPivot('subject_id');
    }

    public function slots(): HasMany
    {
        return $this->hasMany(AvailabilitySlot::class);
    }
}
