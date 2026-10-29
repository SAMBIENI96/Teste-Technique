<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BookingResource extends JsonResource
{
    /**
     * Pas de données de contact du parent : la référence suffit à afficher la confirmation.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'reference'          => $this->reference,
            'student_first_name' => $this->student_first_name,
            'subject'            => $this->subject->name,
            'level'              => $this->level->name,
            'starts_at'          => $this->slot->starts_at->toIso8601String(),
            'ends_at'            => $this->slot->ends_at->toIso8601String(),
            'tutor' => [
                'id'         => $this->tutor->id,
                'first_name' => $this->tutor->first_name,
                'photo_url'  => $this->tutor->photo_url,
            ],
        ];
    }
}
