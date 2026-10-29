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
            // rfc + filter : refuse aussi « a@b » et les espaces, que la RFC tolère
            'parent_email'       => ['required', 'email:rfc,filter', 'max:120'],
            'student_first_name' => ['required', 'string', 'max:50'],
            'notes'              => ['nullable', 'string', 'max:500'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'parent_email.required'       => 'Indiquez votre email.',
            'parent_email.email'          => 'Indiquez un email valide, par exemple vous@exemple.com.',
            'parent_email.max'            => 'Cet email est trop long.',
            'parent_name.required'        => 'Indiquez votre nom.',
            'student_first_name.required' => 'Indiquez le prénom de l\'enfant.',
            'slot_id.required'            => 'Choisissez un créneau.',
        ];
    }
}
