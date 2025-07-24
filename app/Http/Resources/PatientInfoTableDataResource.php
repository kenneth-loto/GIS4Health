<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PatientInfoTableDataResource extends JsonResource
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
            'first_name' => $this->first_name,
            'middle_name' => $this->middle_name,
            'last_name' => $this->last_name,
            'street' => $this->street,
            'municipality' => [
                'id' => $this->municipality->id ?? null,
                'name' => $this->municipality->name ?? null,
            ],
            'barangay' => [
                'id' => $this->barangay->id ?? null,
                'name' => $this->barangay->name ?? null,
            ],
            'suffix' => [
                'id' => $this->suffix->id ?? null,
                'name' => $this->suffix->name ?? null,
            ],
            'latitude' => $this->latitude,
            'longitude' => $this->longitude,
        ];
    }
}
