<?php

namespace App\Http\Controllers;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Models\GioHang;
use App\Models\GioHangChiTiet;
use App\Models\HinhAnh;
use App\Models\KichCo;
use App\Models\SanPham;
use Illuminate\Http\Request;

class GioHangController extends Controller
{

    public function storeGioHangChiTiet(Request $req)
    {
        $timGioHang = GioHang::where('id_tai_khoan', $req->idTaiKhoan)->first();
        $timSanPham = SanPham::where('ma', $req->maSanPham)->first();
        $timKichCo = KichCo::find($req->idKichCo);

        // tìm xem sản phẩm (kích cỡ) đã có trong giỏ hàng chi tiết hay chưa
        $timSanPhamTrongGioHangChiTiet = GioHangChiTiet::where('ten_kich_co', $timKichCo->ten_kich_co)
        ->where('id_gio_hang', $timGioHang->id)->first();
        if ($timSanPhamTrongGioHangChiTiet) { // nếu đã có rồi cộng số lượng lên 1
            $timSanPhamTrongGioHangChiTiet->so_luong = $timSanPhamTrongGioHangChiTiet->so_luong + 1;
            $timSanPhamTrongGioHangChiTiet->save();
        } else { // nếu chưa có thì thêm mới giỏ hàng chi tiết
            $gioHangChiTietMoi = new GioHangChiTiet();
            $gioHangChiTietMoi->id_san_pham = $timSanPham->id;
            $gioHangChiTietMoi->id_gio_hang = $timGioHang->id;
            $gioHangChiTietMoi->ten_kich_co = $timKichCo->ten_kich_co;
            $gioHangChiTietMoi->so_luong = 1;
            $gioHangChiTietMoi->save();
        }

        $listGioHangChiTiet = GioHangChiTiet::where('id_gio_hang', $timGioHang->id)->orderBy('created_at', 'desc')->get(); // tìm danh sách giỏ hàng chi tiết của tài khoản

        $listGioHangChiTiet->map(function ($gioHangChiTiet) {
            $timSanPham = SanPham::find($gioHangChiTiet->id_san_pham);
            $hinhAnh = HinhAnh::where('id_san_pham', $timSanPham->id)->first();
            $gioHangChiTiet->hinh_anh = $hinhAnh->duong_dan_url;
            $gioHangChiTiet->don_gia = $timSanPham->don_gia;
            $gioHangChiTiet->ten = $timSanPham->ten;
            $gioHangChiTiet->ma = $timSanPham->ma;
        });

        return ApiResponse::responseObject($listGioHangChiTiet);
    }

    public function xoaGioHangChiTiet($id)
    {
        $timGioHangChiTiet = GioHangChiTiet::find($id);
        $timGioHang = GioHang::find($timGioHangChiTiet->id_gio_hang);

        $timGioHangChiTiet->delete();

        $listGioHangChiTiet = GioHangChiTiet::where('id_gio_hang', $timGioHang->id)->orderBy('created_at', 'desc')->get(); // tìm danh sách giỏ hàng chi tiết của tài khoản

        $listGioHangChiTiet->map(function ($gioHangChiTiet) {
            $timSanPham = SanPham::find($gioHangChiTiet->id_san_pham);
            $hinhAnh = HinhAnh::where('id_san_pham', $timSanPham->id)->first();
            $gioHangChiTiet->hinh_anh = $hinhAnh->duong_dan_url;
            $gioHangChiTiet->don_gia = $timSanPham->don_gia;
            $gioHangChiTiet->ten = $timSanPham->ten;
            $gioHangChiTiet->ma = $timSanPham->ma;
        });

        return ApiResponse::responseObject($listGioHangChiTiet);
    }
}
