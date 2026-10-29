<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class MatchRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // endpoint public : pas de compte parent dans le prototype
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'level_id'       => ['required', 'integer', 'exists:levels,id'],
            'subject_id'     => ['required', 'integer', 'exists:subjects,id'],
            'windows'        => ['required', 'array', 'min:1', 'max:21'], // 7 jours × 3 moments
            'windows.*.day'  => ['required', 'integer', 'between:1,7'],
            'windows.*.from' => ['required', 'date_format:H:i'],
            'windows.*.to'   => ['required', 'date_format:H:i', 'after:windows.*.from'],
            'goal'           => ['nullable', 'in:exam_prep,catch_up,method,conversation'],
        ];
    }
}
