<?php

namespace Tests\Feature;

use App\Models\Level;
use App\Models\Subject;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class MatchingTest extends TestCase
{
    use RefreshDatabase;

    protected $seed = true;

    private function allWeek(): array
    {
        return collect(range(1, 7))->map(fn ($d) => ['day' => $d, 'from' => '08:00', 'to' => '21:00'])->all();
    }

    private function ids(string $subject, string $level): array
    {
        return [
            'subject_id' => Subject::where('slug', $subject)->value('id'),
            'level_id' => Level::where('slug', $level)->value('id'),
        ];
    }

    public function test_seuls_les_tuteurs_enseignant_la_matiere_a_ce_niveau_sont_proposes(): void
    {
        $criteria = $this->ids('maths', 'college');
        $expected = DB::table('tutor_subject_level')->where($criteria)->pluck('tutor_id')->sort()->values()->all();

        $data = $this->postJson('/api/match', [...$criteria, 'windows' => $this->allWeek()])->assertOk()->json('data');

        $this->assertNotEmpty($data);
        $this->assertEmpty(array_diff(array_column($data, 'id'), $expected));
    }

    public function test_un_tuteur_sans_creneau_compatible_est_exclu(): void
    {
        // Aucun créneau n'est généré à 20h : la fenêtre 20h-21h ne doit rien renvoyer
        $data = $this->postJson('/api/match', [
            ...$this->ids('maths', 'college'),
            'windows' => [['day' => 7, 'from' => '20:00', 'to' => '21:00']],
        ])->assertOk()->json('data');

        $this->assertSame([], $data);
    }

    public function test_les_creneaux_proposes_sont_tous_dans_les_fenetres_choisies(): void
    {
        $data = $this->postJson('/api/match', [
            ...$this->ids('maths', 'college'),
            'windows' => [['day' => 3, 'from' => '17:00', 'to' => '21:00'], ['day' => 6, 'from' => '08:00', 'to' => '12:00']],
        ])->assertOk()->json('data');

        foreach ($data as $tutor) {
            foreach ($tutor['matching_slots'] as $slot) {
                $start = now()->parse($slot['starts_at'])->setTimezone(config('app.timezone'));
                $ok = ($start->dayOfWeekIso === 3 && $start->format('H:i') >= '17:00')
                   || ($start->dayOfWeekIso === 6 && $start->format('H:i') < '12:00');
                $this->assertTrue($ok, "Créneau hors fenêtre : {$slot['starts_at']}");
            }
        }
    }

    public function test_les_tuteurs_sont_classes_par_score_sur_100(): void
    {
        $data = $this->postJson('/api/match', [...$this->ids('maths', 'college'), 'windows' => $this->allWeek(), 'goal' => 'exam_prep'])
            ->assertOk()->json('data');

        $scores = array_column($data, 'score');
        $sorted = $scores;
        rsort($sorted);

        $this->assertSame($sorted, $scores);
        $this->assertLessThanOrEqual(100, max($scores));
        $this->assertSame('Aïcha', $data[0]['first_name']);
        $this->assertContains('Spécialiste de votre objectif', $data[0]['reasons']);
    }

    public function test_le_score_reste_sur_100_quels_que_soient_les_poids(): void
    {
        config(['matching.weights.experience' => 60]);

        $data = $this->postJson('/api/match', [...$this->ids('maths', 'college'), 'windows' => $this->allWeek()])->json('data');

        $this->assertLessThanOrEqual(100, max(array_column($data, 'score')));
    }

    public function test_la_note_bayesienne_ne_favorise_pas_un_tuteur_avec_peu_d_avis(): void
    {
        $names = array_column($this->getJson('/api/tutors')->assertOk()->json('data'), 'first_name');

        // Fatou : 5,0 sur 3 avis ; Aïcha : 4,9 sur 87 avis
        $this->assertLessThan(array_search('Fatou', $names), array_search('Aïcha', $names));
    }

    public function test_une_plage_horaire_inversee_est_refusee(): void
    {
        $this->postJson('/api/match', [
            ...$this->ids('maths', 'college'),
            'windows' => [['day' => 1, 'from' => '20:00', 'to' => '17:00']],
        ])->assertUnprocessable()->assertJsonValidationErrors('windows.0.to');
    }
}
