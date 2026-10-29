<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreBookingRequest extends FormRequest
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
            'slot_id'            => ['required', 'integer', 'exists:availability_slots,id'],
            'subject_id'         => ['required', 'integer', 'exists:subjects,id'],
            'level_id'           => ['required', 'integer', 'exists:levels,id'],
            'parent_name'        => ['required', 'string', 'max:80'],
            'parent_email'       => ['required', 'email:rfc', 'max:120'],
            'student_first_name' => ['required', 'string', 'max:50'],
            'notes'              => ['nullable', 'string', 'max:500'],
        ];
    }
}
