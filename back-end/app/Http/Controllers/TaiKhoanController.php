<?php

namespace App\Http\Controllers;

use App\Exceptions\RestApiException;
use App\Helpers\ApiResponse;
use App\Helpers\CustomCodeHelper;
use App\Http\Controllers\Controller;
use App\Http\Resources\DonHangResource;
use App\Models\DonHang;
use App\Models\GioHang;
use App\Models\GioHangChiTiet;
use App\Models\HinhAnh;
use App\Models\SanPham;
use App\Models\TaiKhoan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class TaiKhoanController extends Controller
{
    public function dangNhap(Request $req)
    {
        // Kiểm tra xem email có tồn tại không
        $taiKhoan = TaiKhoan::where('email', $req->email)->first();

        if (!$taiKhoan) {
            throw new RestApiException("Email không tồn tại");
        }

        // Xác thực mật khẩu
        if (!Hash::check($req->matKhau, $taiKhoan->mat_khau)) {
            throw new RestApiException("Mật khẩu không chính xác");
        }

        $timGioHang = GioHang::where('id_tai_khoan', $taiKhoan->id)->first(); // tìm giỏ hàng của tài khoản
        $listGioHangChiTiet = GioHangChiTiet::where('id_gio_hang', $timGioHang->id)->orderBy('created_at', 'desc')->get(); // tìm danh sách giỏ hàng chi tiết của tài khoản

        $listGioHangChiTiet->map(function ($gioHangChiTiet) {
            $timSanPham = SanPham::find($gioHangChiTiet->id_san_pham);
            $hinhAnh = HinhAnh::where('id_san_pham', $timSanPham->id)->first();
            $gioHangChiTiet->hinh_anh = $hinhAnh->duong_dan_url;
            $gioHangChiTiet->don_gia = $timSanPham->don_gia;
            $gioHangChiTiet->ten = $timSanPham->ten;
            $gioHangChiTiet->ma = $timSanPham->ma;
        });

        $response['taiKhoan'] = $taiKhoan;
        $response['gioHangChiTiet'] = $listGioHangChiTiet;

        return ApiResponse::responseObject($response);
    }

    public function dangKy(Request $req)
    {
        $kiemTraEmailDaTonTai = TaiKhoan::where('email', $req->email)->first();
        if ($kiemTraEmailDaTonTai) {
            throw new RestApiException("Email đã tồn tại");
        }

        $taiKhoanKhachHang = new TaiKhoan();
        $taiKhoanKhachHang->ma = CustomCodeHelper::taoMa(TaiKhoan::query(), 'KH');
        $taiKhoanKhachHang->email = $req->email;
        $taiKhoanKhachHang->mat_khau = bcrypt($req->matKhau);
        $taiKhoanKhachHang->vai_tro = 'khach_hang';
        $taiKhoanKhachHang->save();

        $taoGioHang = new GioHang();
        $taoGioHang->id_tai_khoan = $taiKhoanKhachHang->id;
        $taoGioHang->save();

        return ApiResponse::responseObject($taiKhoanKhachHang);
    }

    public function showLichSuMuaHang($id)
    {
        $lichSuMuaHang = DonHang::where('id_tai_khoan', $id)->get();
        return ApiResponse::responseObject(DonHangResource::collection($lichSuMuaHang));
    }
}
