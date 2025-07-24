<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreHealthCaseRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'patient_info_id' => 'required|exists:patient_infos,id',
            'category_id' => 'required|exists:categories,id',
            'disease_id' => 'required|exists:diseases,id',
            'severity_id' => 'required|exists:severities,id',
        ];
    }
}
