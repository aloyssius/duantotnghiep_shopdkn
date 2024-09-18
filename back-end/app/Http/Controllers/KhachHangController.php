<?php

namespace App\Http\Controllers;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use App\Exceptions\NotFoundException;
use App\Helpers\CustomCodeHelper;
use Illuminate\Http\Request;
use App\Models\TaiKhoan;
use App\Http\Resources\KhachHangResource;

class KhachHangController extends Controller
{

    public function index(Request $req)
    {
        $khachHang = TaiKhoan::query();

        // Hiển thị theo vai_tro khach_hang
        $khachHang->where('vai_tro', 'khach_hang');

        if ($req->filled('tuKhoa')) {
            $tuKhoa = '%' . $req->tuKhoa . '%';
            $khachHang->where(function ($query) use ($tuKhoa) {
                $query->where('ma', 'like', $tuKhoa)
                    ->orWhere('ho_va_ten', 'like', $tuKhoa)
                    ->orWhere('so_dien_thoai', 'like', $tuKhoa)
                    ->orWhere('email', 'like', $tuKhoa);
            });
        }


        // Sắp xếp theo ngày tạo
        $khachHang->orderBy('created_at', 'desc');

        // Phân trang
        // $response = $khachHang->paginate($req->pageSize, ['*'], 'currentPage', $req->currentPage);
        $response = $khachHang->paginate(10, ['*'], 'currentPage', $req->currentPage);
        // $response = $query->paginate($req->input('pageSize', 15), ['*'], 'currentPage', $req->input('currentPage', 1));

        return ApiResponse::responsePage(KhachHangResource::collection($response));
    }

    public function show($id)
    {
        $khachHang = TaiKhoan::find($id);
        if (!$khachHang) {
            throw new NotFoundException("Không tìm thấy khách hàng có id là " . $id);
        }

        return ApiResponse::responseObject(new KhachHangResource($khachHang));
    }

    public function store(Request $req)
    {
        // Tạo mã mới cho khách hàng
        $maMoi = CustomCodeHelper::taoMa(TaiKhoan::query(), 'KH');

        // Tạo một đối tượng TaiKhoan mới từ dữ liệu đã được xác thực
        $khachHang = new TaiKhoan();
        $khachHang->ma = $maMoi; // Đảm bảo mã mới được gán cho trường ma
        $khachHang->ho_va_ten = $req->input('hoVaTen');
        $khachHang->ngay_sinh = $req->input('ngaySinh');
        $khachHang->so_dien_thoai = $req->input('soDienThoai');
        $khachHang->mat_khau = Hash::make($req->input('matKhau')); // Mã hóa mật khẩu
        $khachHang->email = $req->input('email');
        $khachHang->gioi_tinh = $req->input('gioiTinh');
        $khachHang->trang_thai = 'dang_hoat_dong'; //Tự động đặt trạng thái là 'khach_hang'
        $khachHang->vai_tro = 'khach_hang'; // Tự động đặt vai trò là 'khach_hang'

        // Lưu đối tượng TaiKhoan vào cơ sở dữ liệu
        $khachHang->save();

        // Trả về phản hồi với dữ liệu khách hàng mới được tạo
        return ApiResponse::responseObject(new KhachHangResource($khachHang));
    }

    public function update(Request $req, $id)
    {
        $khachHang = TaiKhoan::find($id);
        if (!$khachHang) {
            throw new NotFoundException("Không tìm thấy khách hàng có id là " . $id);
        }

        // $khachHang->ma = $req->input('ma', $khachHang->ma); // Sử dụng giá trị hiện tại nếu không có trong request
        $khachHang->ho_va_ten = $req->input('hoVaTen', $khachHang->ho_va_ten);
        $khachHang->ngay_sinh = $req->input('ngaySinh', $khachHang->ngay_sinh);
        $khachHang->so_dien_thoai = $req->input('soDienThoai', $khachHang->so_dien_thoai);
        if ($req->has('matKhau')) {
            $khachHang->mat_khau = Hash::make($req->input('matKhau')); // Mã hóa mật khẩu nếu có thay đổi
        }
        $khachHang->email = $req->input('email', $khachHang->email);
        $khachHang->gioi_tinh = $req->input('gioiTinh', $khachHang->gioi_tinh);
        // $khachHang->trang_thai = $req->input('trangThai', $khachHang->trang_thai);
        // $khachHang->vai_tro = $req->input('vaiTro', $khachHang->vai_tro);

        // Lưu các thay đổi vào cơ sở dữ liệu
        $khachHang->save();

        // Trả về dữ liệu khách hàng đã cập nhật dưới dạng JSON
        return ApiResponse::responseObject(new KhachHangResource($khachHang));
    }
}
