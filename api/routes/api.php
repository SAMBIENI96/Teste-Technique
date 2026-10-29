<?php

use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\MatchController;
use App\Http\Controllers\Api\MetaController;
use App\Http\Controllers\Api\TutorController;
use Illuminate\Support\Facades\Route;

Route::middleware('throttle:api')->group(function () {
    Route::get('/meta', MetaController::class);
    Route::post('/match', MatchController::class);
    Route::get('/tutors', [TutorController::class, 'index']);
    Route::get('/tutors/{tutor}', [TutorController::class, 'show']);
    Route::get('/tutors/{tutor}/slots', [TutorController::class, 'slots']);
});

Route::post('/bookings', [BookingController::class, 'store'])->middleware('throttle:bookings');
Route::get('/bookings/{reference}', [BookingController::class, 'show'])->middleware('throttle:booking-lookup');
