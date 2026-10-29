<?php

/*
| Réglages de l'algorithme de matching (App\Services\MatchingService).
| Score /100 = 100 × Σ(poids × composante 0–1) / Σ poids. Modifier ici sans toucher au code.
*/

return [
    'horizon_days' => 14,
    'weights' => [
        'availability' => 35,
        'rating'       => 25,
        'experience'   => 20,
        'volume'       => 10,
        'fit'          => 10,
    ],
    'availability_target' => 5,   // nb de créneaux pour un score D = 1
    'bayes' => ['prior' => 4.0, 'weight' => 10],
    'experience_cap' => 10,
];
