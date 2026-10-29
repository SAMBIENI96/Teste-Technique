<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Lecture générale de l'API (méta, matching, créneaux)
        RateLimiter::for('api', fn (Request $request) => Limit::perMinute(60)->by($request->ip()));

        // Création de réservation : anti-spam
        RateLimiter::for('bookings', fn (Request $request) => Limit::perMinute(5)->by($request->ip()));

        // Consultation par référence : empêche l'énumération des références
        RateLimiter::for('booking-lookup', fn (Request $request) => Limit::perMinute(20)->by($request->ip()));
    }
}
