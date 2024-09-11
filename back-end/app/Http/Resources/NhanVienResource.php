<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class NhanVienResource extends JsonResource
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
            'ngaySinh' => $this->ngay_sinh,
            'soDienThoai' => $this->so_dien_thoai,
            'matKhau' => $this->mat_khau,
            'email' => $this->email,
            'gioiTinh' => $this->gioi_tinh,
            'ngayTao' => $this->created_at,
            'trangThai' => $this->trang_thai,
            'vaiTro' => $this->vai_tro,
        ];
    }
}
