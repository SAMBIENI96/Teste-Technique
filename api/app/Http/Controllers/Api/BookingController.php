<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreBookingRequest;
use App\Http\Resources\BookingResource;
use App\Models\Booking;
use App\Services\BookingService;
use Illuminate\Http\JsonResponse;

class BookingController extends Controller
{
    public function store(StoreBookingRequest $request, BookingService $service): JsonResponse
    {
        $booking = $service->book($request->validated());

        return (new BookingResource($booking))->response()->setStatusCode(201);
    }

    public function show(string $reference): BookingResource
    {
        $booking = Booking::with(['slot', 'tutor', 'subject', 'level'])
            ->where('reference', $reference)
            ->firstOrFail();

        return new BookingResource($booking);
    }
}
