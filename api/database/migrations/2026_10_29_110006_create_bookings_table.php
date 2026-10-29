<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->string('reference')->unique();
            $table->foreignId('slot_id')->unique()->constrained('availability_slots'); // verrou anti double réservation
            $table->foreignId('tutor_id')->constrained();
            $table->foreignId('subject_id')->constrained();
            $table->foreignId('level_id')->constrained();
            $table->string('parent_name');
            $table->string('parent_email');
            $table->string('student_first_name');
            $table->text('notes')->nullable();
            $table->timestampsTz();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};
