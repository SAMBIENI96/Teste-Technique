<?php

namespace App\Services;

use App\Models\AvailabilitySlot;
use App\Models\Tutor;
use Carbon\CarbonImmutable;
use Illuminate\Support\Collection;

class MatchingService
{
    /**
     * Filtre les tuteurs sur les critères obligatoires, puis les classe par score.
     *
     * @param  array{level_id:int, subject_id:int, windows:array, goal?:string|null}  $criteria
     * @return Collection<int, Tutor>
     */
    public function match(array $criteria): Collection
    {
        $now = CarbonImmutable::now();
        $until = $now->addDays(config('matching.horizon_days'));

        // 1) Filtre éliminatoire SQL : matière enseignée à ce niveau
        $tutors = Tutor::query()
            ->whereExists(function ($q) use ($criteria) {
                $q->selectRaw(1)->from('tutor_subject_level')
                    ->whereColumn('tutor_subject_level.tutor_id', 'tutors.id')
                    ->where('subject_id', $criteria['subject_id'])
                    ->where('level_id', $criteria['level_id']);
            })
            ->with(['slots' => fn ($q) => $q->available()
                ->whereBetween('starts_at', [$now, $until])
                ->orderBy('starts_at')])
            ->with('subjects:id,name')
            ->get();

        $maxLessons = max(1, (int) $tutors->max('lessons_count'));

        // 2) Filtre éliminatoire disponibilité, puis score
        return $tutors
            ->map(function (Tutor $tutor) use ($criteria, $maxLessons) {
                $matching = $tutor->slots
                    ->filter(fn (AvailabilitySlot $s) => $this->inWindows($s, $criteria['windows']))
                    ->values();

                if ($matching->isEmpty()) {
                    return null; // critère obligatoire non respecté → exclu
                }

                [$score, $reasons] = $this->score($tutor, $matching, $criteria, $maxLessons);

                $tutor->setAttribute('score', $score);
                $tutor->setAttribute('reasons', $reasons);
                $tutor->setAttribute('matching_slots', $matching);

                return $tutor;
            })
            ->filter()
            ->sortByDesc('score')
            ->values();
    }

    /** windows: [{day: 1..7 (lundi=1), from: "17:00", to: "20:00"}], heures locales de l'application */
    private function inWindows(AvailabilitySlot $slot, array $windows): bool
    {
        $start = $slot->starts_at->setTimezone(config('app.timezone'));
        $day = $start->dayOfWeekIso;
        $time = $start->format('H:i');

        foreach ($windows as $w) {
            if ((int) $w['day'] === $day && $time >= $w['from'] && $time < $w['to']) {
                return true;
            }
        }

        return false;
    }

    /** @return array{0:int, 1:array<int, string>} score /100 et 3 raisons lisibles max */
    private function score(Tutor $t, Collection $slots, array $c, int $maxLessons): array
    {
        $w = config('matching.weights');
        $bayes = config('matching.bayes');

        $d = min($slots->count() / config('matching.availability_target'), 1);
        $bayesRating = ($t->reviews_count * $t->rating + $bayes['weight'] * $bayes['prior'])
                     / ($t->reviews_count + $bayes['weight']);
        $r = $bayesRating / 5;
        $e = min($t->years_experience / config('matching.experience_cap'), 1);
        $v = log(1 + $t->lessons_count) / log(1 + $maxLessons);
        $goal = $c['goal'] ?? null;
        $fits = $goal && in_array($goal, $t->specialties ?? [], true);
        $p = $fits ? 1 : 0.5;

        // Normalisé par la somme des poids : reste sur 100 quels que soient les réglages
        $score = round(100 * ($w['availability'] * $d + $w['rating'] * $r + $w['experience'] * $e
                     + $w['volume'] * $v + $w['fit'] * $p) / array_sum($w));

        $reasons = [];
        if ($fits) {
            $reasons[] = 'Spécialiste de votre objectif';
        }
        $n = $slots->count();
        $reasons[] = $n . ' créneau' . ($n > 1 ? 'x' : '') . ' compatible' . ($n > 1 ? 's' : '');
        if ($t->reviews_count >= 5) {
            $reasons[] = 'Noté ' . number_format($t->rating, 1, ',', '') . ' sur ' . $t->reviews_count . ' avis';
        } else {
            $reasons[] = 'Nouveau tuteur';
        }
        if ($t->years_experience >= 5) {
            $reasons[] = $t->years_experience . ' ans d\'expérience';
        }

        return [(int) $score, array_slice($reasons, 0, 3)];
    }
}
