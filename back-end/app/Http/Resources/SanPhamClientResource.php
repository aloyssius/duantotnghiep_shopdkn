<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SanPhamClientResource extends JsonResource
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
            'ma' => $this->ma,
            'ten' => $this->ten,
            'donGia' => $this->don_gia,
            'hinhAnh' => $this->hinhAnh,
        ];
    }
    /**
     * Get the fields that should be selected from the database.
     *
     * @return array
     */
}
