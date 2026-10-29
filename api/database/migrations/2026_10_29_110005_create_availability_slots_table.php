<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('availability_slots', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tutor_id')->constrained()->cascadeOnDelete();
            $table->timestampTz('starts_at');
            $table->timestampTz('ends_at');
            $table->string('status')->default('available'); // available | booked
            $table->timestampsTz();

            $table->index(['tutor_id', 'starts_at', 'status']);
            $table->unique(['tutor_id', 'starts_at']);
        });

        DB::statement("ALTER TABLE availability_slots ADD CONSTRAINT availability_slots_status_check CHECK (status IN ('available', 'booked'))");
        DB::statement('ALTER TABLE availability_slots ADD CONSTRAINT availability_slots_period_check CHECK (ends_at > starts_at)');
    }

    public function down(): void
    {
        Schema::dropIfExists('availability_slots');
    }
};
