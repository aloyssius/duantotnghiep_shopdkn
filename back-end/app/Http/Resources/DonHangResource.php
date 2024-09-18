<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DonHangResource extends JsonResource
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
            'hoVaTen' => $this->ho_va_ten,
            'soDienThoai' => $this->so_dien_thoai,
            'tongTien' => $this->tong_tien_hang,
            'trangThai' => $this->trang_thai,
            'ngayTao' => $this->created_at,
        ];
    }
}
