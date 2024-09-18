<?php

namespace App\Http\Controllers;

use App\Constants\OrderStatus;
use App\Helpers\ApiResponse;
use App\Helpers\CustomCodeHelper;
use App\Http\Controllers\Controller;
use App\Http\Resources\DonHangChiTietResource;
use App\Http\Resources\DonHangResource;
use App\Jobs\SendEmailPlaceOrderSuccess;
use App\Mail\PlaceOrderSuccessEmail;
use App\Models\DonHang;
use App\Models\DonHangChiTiet;
use App\Models\GioHang;
use App\Models\GioHangChiTiet;
use App\Models\HinhAnh;
use App\Models\KichCo;
use App\Models\SanPham;
use Illuminate\Http\Request;

class DonHangClientController extends Controller
{

    public function danhSachDonHangCuaTaiKhoan($id)
    {
        $listDonHang = DonHang::where("id_tai_khoan", $id)->orderBy('created_at', 'desc')->get();

        return ApiResponse::responseObject(DonHangResource::collection($listDonHang));
    }

    public function chiTietDonHang($ma)
    {
        $timDonHang = DonHang::where("ma", $ma)->first();

        $listDonHangChiTiet = DonHangChiTiet::where('id_don_hang', $timDonHang->id)->get();

        $listDonHangChiTiet->map(function ($donHangChiTiet) {
            $timSanPham = SanPham::find($donHangChiTiet->id_san_pham);
            $hinhAnh = HinhAnh::where('id_san_pham', $timSanPham->id)->first();
            $donHangChiTiet->hinh_anh = $hinhAnh->duong_dan_url;
            $donHangChiTiet->don_gia = $timSanPham->don_gia;
            $donHangChiTiet->ten = $timSanPham->ten;
            $donHangChiTiet->ma = $timSanPham->ma;
        });

        $timDonHang['listDonHangChiTiet'] = $listDonHangChiTiet;

        return ApiResponse::responseObject(new DonHangChiTietResource($timDonHang));
    }

    public function storeDatHang(Request $req)
    {
        $donHang = DonHang::query();
        $donHangMoi = new DonHang();

        // lưu đơn hàng
        $donHangMoi->ma = CustomCodeHelper::taoMa($donHang, 'HD');
        $donHangMoi->trang_thai = OrderStatus::CHO_XAC_NHAN;
        $donHangMoi->ho_va_ten = $req->hoVaTen;
        $donHangMoi->so_dien_thoai = $req->soDienThoai;
        $donHangMoi->email = $req->email;
        $donHangMoi->dia_chi = $req->diaChi;
        $donHangMoi->tien_ship = $req->tienShip;
        $donHangMoi->tong_tien_hang = $req->tongTienHang;
        $donHangMoi->id_tai_khoan = $req->idTaiKhoan;
        $donHangMoi->save();

        // lưu đơn hàng chi tiết dựa vào list giỏ hàng chi tiết từ front end
        foreach ($req->listGioHangChiTiet as $gioHangChiTiet) {

            $donHangChiTiet = new DonHangChiTiet();
            $donHangChiTiet->id_san_pham = $gioHangChiTiet['id_san_pham'];
            $donHangChiTiet->id_don_hang = $donHangMoi['id'];
            $donHangChiTiet->so_luong = $gioHangChiTiet['so_luong'];
            $donHangChiTiet->don_gia = $gioHangChiTiet['don_gia'];
            $donHangChiTiet->ten_kich_co = $gioHangChiTiet['ten_kich_co'];
            $donHangChiTiet->save();

            $timKichCo = KichCo::where('id_san_pham', $donHangChiTiet->id_san_pham)->where('ten_kich_co', $donHangChiTiet->ten_kich_co)->first();
            $timKichCo->so_luong_ton = $timKichCo->so_luong_ton - $donHangChiTiet->so_luong;
            $timKichCo->save();
        }

        // xóa tất cả giỏ hàng chi tiết của tài khoản
        $gioHang = GioHang::where('id_tai_khoan', $donHangMoi->id_tai_khoan)->first();
        $listGioHangChiTiet = GioHangChiTiet::where('id_gio_hang', $gioHang->id)->delete();

        return ApiResponse::responseObject($donHangMoi);
    }
}
