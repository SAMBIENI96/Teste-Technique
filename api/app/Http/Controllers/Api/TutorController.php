<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\TutorResource;
use App\Models\Tutor;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Collection;

class TutorController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        // Même note bayésienne que le matching : 3 avis à 5,0 ne passent pas devant 87 avis à 4,9
        ['prior' => $prior, 'weight' => $weight] = config('matching.bayes');

        $tutors = Tutor::with(['subjects:id,name', 'levels:id,name,order'])
            ->orderByRaw('(reviews_count * rating + ?::numeric * ?::numeric) / (reviews_count + ?::numeric) desc', [$weight, $prior, $weight])
            ->get();

        return TutorResource::collection($tutors);
    }

    public function show(Tutor $tutor): TutorResource
    {
        return new TutorResource($tutor->load(['subjects:id,name', 'levels:id,name,order']));
    }

    /** Créneaux libres sur l'horizon de réservation. */
    public function slots(Tutor $tutor): Collection
    {
        return $tutor->slots()->available()
            ->where('starts_at', '>', now())
            ->where('starts_at', '<', now()->addDays(config('matching.horizon_days')))
            ->orderBy('starts_at')
            ->get(['id', 'starts_at', 'ends_at'])
            ->map(fn ($s) => [
                'id'        => $s->id,
                'starts_at' => $s->starts_at->toIso8601String(),
                'ends_at'   => $s->ends_at->toIso8601String(),
            ]);
    }
}
