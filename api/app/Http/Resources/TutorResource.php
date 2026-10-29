<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TutorResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'               => $this->id,
            'first_name'       => $this->first_name,
            'photo_url'        => $this->photo_url,
            'bio'              => $this->bio,
            'years_experience' => $this->years_experience,
            'rating'           => $this->rating,
            'reviews_count'    => $this->reviews_count,
            'lessons_count'    => $this->lessons_count,
            'subjects'         => $this->subjects->pluck('name')->unique()->values(),
            'levels'           => $this->levels->sortBy('order')->pluck('name')->unique()->values(),
        ];
    }
}
