<?php

namespace Tests\Feature;

use App\Enums\SlotStatus;
use App\Models\AvailabilitySlot;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class BookingTest extends TestCase
{
    use RefreshDatabase;

    protected $seed = true;

    /** Créneau futur libre + un couple matière × niveau que son tuteur enseigne. */
    private function bookingPayload(array $overrides = []): array
    {
        $slot = AvailabilitySlot::available()->where('starts_at', '>', now())->orderBy('id')->firstOrFail();
        $pivot = DB::table('tutor_subject_level')->where('tutor_id', $slot->tutor_id)->first();

        return [
            'slot_id' => $slot->id,
            'subject_id' => $pivot->subject_id,
            'level_id' => $pivot->level_id,
            'parent_name' => 'Mme Benali',
            'parent_email' => 'benali@example.com',
            'student_first_name' => 'Yanis',
            ...$overrides,
        ];
    }

    public function test_une_reservation_est_confirmee_et_bloque_le_creneau(): void
    {
        $payload = $this->bookingPayload();

        $this->postJson('/api/bookings', $payload)
            ->assertCreated()
            ->assertJsonPath('data.student_first_name', 'Yanis')
            ->assertJsonMissingPath('data.parent_email'); // pas de coordonnées dans la réponse

        $this->assertSame(SlotStatus::Booked, AvailabilitySlot::find($payload['slot_id'])->status);
        $this->assertDatabaseHas('bookings', ['slot_id' => $payload['slot_id']]);
    }

    public function test_un_creneau_ne_peut_pas_etre_reserve_deux_fois(): void
    {
        $payload = $this->bookingPayload();

        $this->postJson('/api/bookings', $payload)->assertCreated();
        $this->postJson('/api/bookings', [...$payload, 'parent_email' => 'autre@example.com'])->assertConflict();

        $this->assertDatabaseCount('bookings', 1);
    }

    public function test_le_creneau_reserve_disparait_des_disponibilites(): void
    {
        $payload = $this->bookingPayload();
        $slot = AvailabilitySlot::find($payload['slot_id']);

        $this->postJson('/api/bookings', $payload)->assertCreated();

        $slots = $this->getJson("/api/tutors/{$slot->tutor_id}/slots")->assertOk()->json();
        $this->assertNotContains($slot->id, array_column($slots, 'id'));

        $window = ['day' => $slot->starts_at->dayOfWeekIso, 'from' => '00:00', 'to' => '23:59'];
        $match = $this->postJson('/api/match', [
            'subject_id' => $payload['subject_id'],
            'level_id' => $payload['level_id'],
            'windows' => [$window],
        ])->assertOk()->json('data');

        $proposed = collect($match)->flatMap(fn ($t) => array_column($t['matching_slots'], 'id'));
        $this->assertNotContains($slot->id, $proposed);
    }

    public function test_une_matiere_non_enseignee_par_le_tuteur_est_refusee(): void
    {
        $payload = $this->bookingPayload();
        $taught = DB::table('tutor_subject_level')
            ->where('tutor_id', AvailabilitySlot::find($payload['slot_id'])->tutor_id)
            ->pluck('subject_id');
        $other = DB::table('subjects')->whereNotIn('id', $taught)->value('id');

        $this->postJson('/api/bookings', [...$payload, 'subject_id' => $other])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('subject_id');

        $this->assertSame(SlotStatus::Available, AvailabilitySlot::find($payload['slot_id'])->status);
    }

    public function test_un_creneau_passe_ne_peut_pas_etre_reserve(): void
    {
        $payload = $this->bookingPayload();
        AvailabilitySlot::whereKey($payload['slot_id'])->update([
            'starts_at' => now()->subHours(2), 'ends_at' => now()->subHour(),
        ]);

        $this->postJson('/api/bookings', $payload)->assertConflict();
    }

    public function test_les_champs_obligatoires_sont_valides(): void
    {
        $this->postJson('/api/bookings', [])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['slot_id', 'subject_id', 'level_id', 'parent_name', 'parent_email', 'student_first_name']);
    }

    public function test_une_reservation_se_consulte_par_sa_reference(): void
    {
        $reference = $this->postJson('/api/bookings', $this->bookingPayload())->json('data.reference');

        $this->assertMatchesRegularExpression('/^TM-[A-Z0-9]{10}$/', $reference);
        $this->getJson("/api/bookings/{$reference}")->assertOk()->assertJsonPath('data.reference', $reference);
        $this->getJson('/api/bookings/TM-INCONNUE0')->assertNotFound();
    }
}
