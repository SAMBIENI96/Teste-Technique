<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\MatchRequest;
use App\Http\Resources\TutorMatchResource;
use App\Services\MatchingService;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class MatchController extends Controller
{
    public function __invoke(MatchRequest $request, MatchingService $matching): AnonymousResourceCollection
    {
        return TutorMatchResource::collection($matching->match($request->validated()));
    }
}
