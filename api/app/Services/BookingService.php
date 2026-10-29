<?php

namespace App\Services;

use App\Enums\SlotStatus;
use App\Models\AvailabilitySlot;
use App\Models\Booking;
use Illuminate\Database\UniqueConstraintViolationException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\ConflictHttpException;

class BookingService
{
    public function book(array $data): Booking
    {
        try {
            return DB::transaction(function () use ($data) {
                // Verrou ligne : deux requêtes simultanées ne peuvent pas lire "available" en même temps
                $slot = AvailabilitySlot::whereKey($data['slot_id'])->lockForUpdate()->firstOrFail();

                if ($slot->status !== SlotStatus::Available || $slot->starts_at->isPast()) {
                    throw new ConflictHttpException('Ce créneau vient d\'être réservé.');
                }

                $teaches = DB::table('tutor_subject_level')
                    ->where('tutor_id', $slot->tutor_id)
                    ->where('subject_id', $data['subject_id'])
                    ->where('level_id', $data['level_id'])
                    ->exists();

                if (! $teaches) {
                    throw ValidationException::withMessages([
                        'subject_id' => 'Ce tuteur n\'enseigne pas cette matière à ce niveau.',
                    ]);
                }

                $slot->update(['status' => SlotStatus::Booked]);

                return Booking::create([
                    ...$data,
                    'tutor_id'  => $slot->tutor_id,
                    'reference' => 'TM-' . strtoupper(Str::random(10)), // ~3,6·10¹⁵ combinaisons : non devinable
                ])->load(['slot', 'tutor', 'subject', 'level']);
            });
        } catch (UniqueConstraintViolationException) {
            // Filet de sécurité : la contrainte UNIQUE sur bookings.slot_id a tranché
            throw new ConflictHttpException('Ce créneau vient d\'être réservé.');
        }
    }
}
