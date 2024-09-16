<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MauSacResource extends JsonResource
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
            'maMauSac' => $this->ma,
            'tenMauSac' => $this->ten,
            'trangThai' => $this->trang_thai,
            'ngayTao' => $this->created_at,
        ];
    }
    /**
     * Get the fields that should be selected from the database.
     *
     * @return array
     */
}
