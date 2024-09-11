<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SanPhamResource extends JsonResource
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
            'maSanPham' => $this->ma,
            'tenSanPham' => $this->ten,
            'moTa' => $this->mo_ta,
            'trangThai' => $this->trang_thai,
            'ngayTao' => $this->created_at,
            'donGia' => $this->don_gia,
            'idThuongHieu' => $this->id_thuong_hieu,
            'idMauSac' => $this->id_mau_sac,
        ];
    }
    /**
     * Get the fields that should be selected from the database.
     *
     * @return array
     */
}
