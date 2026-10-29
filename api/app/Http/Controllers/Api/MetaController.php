<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Level;
use App\Models\Subject;

class MetaController extends Controller
{
    /** Référentiels du formulaire de recherche. */
    public function __invoke(): array
    {
        return [
            'subjects' => Subject::orderBy('name')->get(['id', 'name', 'slug', 'icon']),
            'levels'   => Level::orderBy('order')->get(['id', 'name', 'slug']),
        ];
    }
}
