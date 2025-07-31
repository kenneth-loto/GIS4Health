<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class HealthCaseTableDataResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'patient_info' => [
                'id' => $this->patient_info->id,
                'first_name' => $this->patient_info->first_name,
                'middle_name' => $this->patient_info->middle_name,
                'last_name' => $this->patient_info->last_name,
                'suffix' => [
                    'id' => $this->patient_info->suffix->id ?? null,
                    'name' => $this->patient_info->suffix->name ?? null,
                ],
                'municipality' => [
                    'id' => $this->patient_info->municipality->id ?? null,
                    'name' => $this->patient_info->municipality->name ?? null,
                ],
                'barangay' => [
                    'id' => $this->patient_info->barangay->id ?? null,
                    'name' => $this->patient_info->barangay->name ?? null,
                ],
                'street' => $this->patient_info->street,
            ],
            'category' => [
                'id' => $this->category->id ?? null,
                'name' => $this->category->name ?? null,
            ],
            'disease' => [
                'id' => $this->disease->id ?? null,
                'name' => $this->disease->name ?? null,
            ],
            'severity' => [
                'id' => $this->severity->id ?? null,
                'name' => $this->severity->name ?? null,
            ],
        ];
    }
}
