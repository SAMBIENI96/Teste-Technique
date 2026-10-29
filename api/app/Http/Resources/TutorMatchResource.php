<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TutorMatchResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $score = $this->score;

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
            'score'            => $score,
            'label'            => $score >= 75 ? 'Très compatible' : 'Compatible',
            'reasons'          => $this->reasons,
            'matching_slots'   => $this->matching_slots->map(fn ($s) => [
                'id'        => $s->id,
                'starts_at' => $s->starts_at->toIso8601String(),
                'ends_at'   => $s->ends_at->toIso8601String(),
            ]),
        ];
    }
}
