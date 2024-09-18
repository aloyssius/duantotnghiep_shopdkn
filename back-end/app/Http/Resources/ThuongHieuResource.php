<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ThuongHieuResource extends JsonResource
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
            'maThuongHieu' => $this->ma,
            'tenThuongHieu' => $this->ten,
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
