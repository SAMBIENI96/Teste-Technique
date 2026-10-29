<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('availability_slots', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tutor_id')->constrained()->cascadeOnDelete();
            $table->timestamp('starts_at');
            $table->timestamp('ends_at');
            $table->string('status')->default('available'); // available | booked
            $table->timestamps();

            $table->index(['tutor_id', 'starts_at', 'status']);
            $table->unique(['tutor_id', 'starts_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('availability_slots');
    }
};
