<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DonHangChiTietResource extends JsonResource
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
            'email' => $this->email,
            'diaChi' => $this->dia_chi,
            'trangThai' => $this->trang_thai,
            'ngayTao' => $this->created_at,
            'ngayGiaoHang' => $this->ngay_giao_hang,
            'ngayHoanThanh' => $this->ngay_hoan_thanh,
            'ngayHuyDon' => $this->ngay_huy_don,
            'tongTien' => $this->tong_tien_hang,
            'tienShip' => $this->tien_ship,
            'listDonHangChiTiet' => $this->listDonHangChiTiet,
        ];
    }
}
