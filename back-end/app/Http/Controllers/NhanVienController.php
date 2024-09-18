<?php

namespace App\Http\Controllers;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use App\Exceptions\NotFoundException;
use Illuminate\Http\Request;
use App\Models\TaiKhoan;
use App\Http\Resources\NhanVienResource;
use App\Helpers\CustomCodeHelper;

class NhanVienController extends Controller
{

    public function index(Request $req)
    {
        $nhanVien = TaiKhoan::query();

        // Hiển thị theo vai_tro nhan_vien
        $nhanVien->where('vai_tro', 'nhan_vien');

        if ($req->filled('tuKhoa')) {
            $tuKhoa = '%' . $req->tuKhoa . '%';
            $nhanVien->where(function ($query) use ($tuKhoa) {
                $query->where('ma', 'like', $tuKhoa)
                    ->orWhere('ho_va_ten', 'like', $tuKhoa)
                    ->orWhere('so_dien_thoai', 'like', $tuKhoa)
                    ->orWhere('email', 'like', $tuKhoa);
            });
        }

        if ($req->filled('trangThai')) {
            $nhanVien->where('trang_thai', $req->trangThai);
        }

        // Sắp xếp theo ngày tạo
        $nhanVien->orderBy('created_at', 'desc');

        // Phân trang
        $response = $nhanVien->paginate($req->pageSize, ['*'], 'currentPage', $req->currentPage);
        // $response = $query->paginate($req->input('pageSize', 15), ['*'], 'currentPage', $req->input('currentPage', 1));

        return ApiResponse::responsePage(NhanVienResource::collection($response));
    }

    public function show($id)
    {
        $nhanVien = TaiKhoan::find($id);
        if (!$nhanVien) {
            throw new NotFoundException("Không tìm thấy nhân viên có id là " . $id);
        }

        return ApiResponse::responseObject(new NhanVienResource($nhanVien));
    }

    public function update(Request $req, $id)
    {
        $nhanVien = TaiKhoan::find($id);
        if (!$nhanVien) {
            throw new NotFoundException("Không tìm thấy nhân viên có id là " . $id);
        }

        // $nhanVien->ma = $req->input('ma', $nhanVien->ma); // Sử dụng giá trị hiện tại nếu không có trong request
        $nhanVien->ho_va_ten = $req->input('hoVaTen', $nhanVien->ho_va_ten);
        $nhanVien->ngay_sinh = $req->input('ngaySinh', $nhanVien->ngay_sinh);
        $nhanVien->so_dien_thoai = $req->input('soDienThoai', $nhanVien->so_dien_thoai);
        if ($req->has('matKhau')) {
            $nhanVien->mat_khau = Hash::make($req->input('matKhau')); // Mã hóa mật khẩu nếu có thay đổi
        }
        $nhanVien->email = $req->input('email', $nhanVien->email);
        $nhanVien->gioi_tinh = $req->input('gioiTinh', $nhanVien->gioi_tinh);
        $nhanVien->trang_thai = $req->input('trangThai', $nhanVien->trang_thai);
        // $nhanVien->vai_tro = $req->input('vaiTro', $nhanVien->vai_tro);

        // Lưu các thay đổi vào cơ sở dữ liệu
        $nhanVien->save();

        // Trả về dữ liệu khách hàng đã cập nhật dưới dạng JSON
        return ApiResponse::responseObject(new NhanVienResource($nhanVien));
    }

    public function store(Request $req)
    {
        // Tạo mã mới cho nhân viên
        $maMoi = CustomCodeHelper::taoMa(TaiKhoan::query(), 'NV');

        // Tạo một đối tượng TaiKhoan mới từ dữ liệu đã được xác thực
        $nhanVien = new TaiKhoan();
        $nhanVien->ma = $maMoi; // Đảm bảo mã mới được gán cho trường ma
        $nhanVien->ho_va_ten = $req->input('hoVaTen');
        $nhanVien->ngay_sinh = $req->input('ngaySinh');
        $nhanVien->so_dien_thoai = $req->input('soDienThoai');
        $nhanVien->mat_khau = Hash::make($req->input('matKhau')); // Mã hóa mật khẩu
        $nhanVien->email = $req->input('email');
        $nhanVien->gioi_tinh = $req->input('gioiTinh');
        $nhanVien->trang_thai = 'dang_hoat_dong'; //Tự động đặt trạng thái là 'khach_hang'
        $nhanVien->vai_tro = 'nhan_vien'; // Tự động đặt vai trò là 'khach_hang'

        // Lưu đối tượng TaiKhoan vào cơ sở dữ liệu
        $nhanVien->save();

        // Trả về phản hồi với dữ liệu khách hàng mới được tạo
        return ApiResponse::responseObject(new NhanVienResource($nhanVien));
    }
}
