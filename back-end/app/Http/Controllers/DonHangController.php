<?php

namespace App\Http\Controllers;

use App\Constants\OrderStatus;
use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Resources\DonHangChiTietResource;
use App\Http\Resources\DonHangResource;
use App\Models\Bill;
use App\Models\DonHang;
use App\Models\DonHangChiTiet;
use App\Models\HinhAnh;
use App\Models\KichCo;
use App\Models\SanPham;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DonHangController extends Controller
{
    public function index(Request $req)
    {

        $listDonHang = DonHang::query();

        // tìm kiếm theo từ khóa
        if ($req->filled('tuKhoa')) {
            $tuKhoa = '%' . $req->tuKhoa . '%';
            $listDonHang->where(function ($query) use ($tuKhoa) {
                $query->where('ho_va_ten', 'like', $tuKhoa)
                    ->orWhere('ma', 'like', $tuKhoa)
                    ->orWhere('so_dien_thoai', 'like', $tuKhoa);
            });
        }

        // lọc theo trạng thái
        if ($req->filled('trangThai')) {
            $listDonHang->where('trang_thai', $req->trangThai);
        }

        // lọc theo khoảng ngày
        $listDonHang->when($req->filled('tuNgay') && $req->filled('denNgay'), function ($query) use ($req) {
            // lọc từ ngày đến ngày
            $tuNgay = Carbon::parse($req->tuNgay)->startOfDay();
            $denNgay = Carbon::parse($req->denNgay)->endOfDay();
            return $query->whereBetween('created_at', [$tuNgay, $denNgay]);
        })
            // lọc từ ngày trở đi
            ->when($req->filled('tuNgay') && !$req->filled('denNgay'), function ($query) use ($req) {
                $tuNgay = Carbon::parse($req->tuNgay)->startOfDay();
                $query->where('created_at', '>=', $tuNgay);
            })

            // lọc đến ngày trở về
            ->when(!$req->filled('tuNgay') && $req->filled('denNgay'), function ($query) use ($req) {
                $denNgay = Carbon::parse($req->denNgay)->endOfDay();
                $query->where('created_at', '<=', $denNgay);
            });

        // sắp xếp đơn hàng mới nhất
        $listDonHang->orderBy('created_at', 'desc');

        // phân trang
        $response = $listDonHang->paginate(10, ['*'], 'currentPage', $req->currentPage);

        return ApiResponse::responsePage(DonHangResource::collection($response));
    }

    public function show($id)
    {
        $timDonHang = DonHang::find($id);

        $listDonHangChiTiet = DonHangChiTiet::where('id_don_hang', $timDonHang->id)->get();

        $listDonHangChiTiet->map(function ($donHangChiTiet) {
            $timSanPham = SanPham::find($donHangChiTiet->id_san_pham);
            $hinhAnh = HinhAnh::where('id_san_pham', $timSanPham->id)->first();
            $donHangChiTiet->hinh_anh = $hinhAnh->duong_dan_url;
            $donHangChiTiet->ten = $timSanPham->ten;
            $donHangChiTiet->ma = $timSanPham->ma;
        });

        $timDonHang['listDonHangChiTiet'] = $listDonHangChiTiet;

        return ApiResponse::responseObject(new DonHangChiTietResource($timDonHang));
    }

    public function huyDonHang($id)
    {
        $timDonHang = DonHang::find($id);

        $timDonHang->trang_thai = OrderStatus::DA_HUY;
        $timDonHang->ngay_huy_don = now(); // now() => là thời gian hiện tại
        $timDonHang->save();

        $listDonHangChiTiet = DonHangChiTiet::where('id_don_hang', $timDonHang->id)->get();

        $listDonHangChiTiet->map(function ($donHangChiTiet) {
            $timSanPham = SanPham::find($donHangChiTiet->id_san_pham);
            $hinhAnh = HinhAnh::where('id_san_pham', $timSanPham->id)->first();
            $donHangChiTiet->hinh_anh = $hinhAnh->duong_dan_url;
            $donHangChiTiet->ten = $timSanPham->ten;
            $donHangChiTiet->ma = $timSanPham->ma;
        });

        $timDonHang['listDonHangChiTiet'] = $listDonHangChiTiet;

        return ApiResponse::responseObject(new DonHangChiTietResource($timDonHang));
    }

    public function capNhatTrangThaiDonHang($id)
    {
        $timDonHang = DonHang::find($id);

        if ($timDonHang->trang_thai === OrderStatus::CHO_XAC_NHAN) { // nếu đang ở trạng thái chờ xác nhận
            $timDonHang->trang_thai = OrderStatus::CHO_GIAO_HANG; // => cập nhật trạng thái thành chờ giao hàng (tức là đã xác nhận đơn hàng)
            $timDonHang->save();
        } else if ($timDonHang->trang_thai === OrderStatus::CHO_GIAO_HANG) { // nếu đang ở trạng thái chờ giao hàng (chờ giao tức là sắp được đi giao)
            $timDonHang->trang_thai = OrderStatus::DANG_GIAO_HANG; // => cập nhật trạng thái thành đang giao hàng (tức là đơn hàng đã được đi giao)
            $timDonHang->ngay_giao_hang = now(); // cập nhật ngày giao hàng, now() => là thời gian hiện tại
            $timDonHang->save();
        } else if ($timDonHang->trang_thai === OrderStatus::DANG_GIAO_HANG) { // nếu đang ở trạng thái đang giao hàng
            $timDonHang->trang_thai = OrderStatus::HOAN_THANH; // => cập nhật trạng thái thành hoàn thành đơn hàng
            $timDonHang->ngay_hoan_thanh = now(); // cập nhật ngày giao hàng, now() => là thời gian hiện tại
            $timDonHang->save();
        }

        $listDonHangChiTiet = DonHangChiTiet::where('id_don_hang', $timDonHang->id)->get();

        $listDonHangChiTiet->map(function ($donHangChiTiet) {
            $timSanPham = SanPham::find($donHangChiTiet->id_san_pham);
            $hinhAnh = HinhAnh::where('id_san_pham', $timSanPham->id)->first();
            $donHangChiTiet->hinh_anh = $hinhAnh->duong_dan_url;
            $donHangChiTiet->ten = $timSanPham->ten;
            $donHangChiTiet->ma = $timSanPham->ma;
        });

        $timDonHang['listDonHangChiTiet'] = $listDonHangChiTiet;

        return ApiResponse::responseObject(new DonHangChiTietResource($timDonHang));
    }

    public function thongKe()
    {

        $tongSoDonHangDaBan = DonHang::where('trang_thai', 'hoan_thanh')->count();
        $tongSoLuongSanPhamDaBan = DB::table('don_hang_chi_tiet')
            ->join('don_hang', 'don_hang.id', '=', 'don_hang_chi_tiet.id_don_hang')
            ->where('don_hang.trang_thai', 'hoan_thanh')
            ->sum('don_hang_chi_tiet.so_luong');
        $tongDoanhThu = DonHang::where('trang_thai', 'hoan_thanh')->sum('tong_tien_hang');

        $tongTatCaDoanhThu = [
            'tongSoLuongSanPhamDaBan' => $tongSoLuongSanPhamDaBan,
            'tongSoDonHangDaBan' => $tongSoDonHangDaBan,
            'tongDoanhThu' => $tongDoanhThu,
        ];

        $tongSoLuongSanPhamDaBanTuan = DB::table('don_hang_chi_tiet')
            ->join('don_hang', 'don_hang.id', '=', 'don_hang_chi_tiet.id_don_hang')
            ->where('don_hang.trang_thai', 'hoan_thanh')
            ->whereBetween('don_hang.created_at', [Carbon::now()->startOfWeek(), Carbon::now()->endOfWeek()])
            ->sum('don_hang_chi_tiet.so_luong');

        $tongSoDonHangDaBanTuan = DonHang::where('trang_thai', 'hoan_thanh')
            ->whereBetween('created_at', [Carbon::now()->startOfWeek(), Carbon::now()->endOfWeek()])
            ->count();

        $tongDoanhThuTuan = DonHang::where('trang_thai', 'hoan_thanh')
            ->whereBetween('created_at', [Carbon::now()->startOfWeek(), Carbon::now()->endOfWeek()])
            ->sum('tong_tien_hang');

        $tongTatCaDoanhThuTuan = [
            'tongSoLuongSanPhamDaBanTuan' => $tongSoLuongSanPhamDaBanTuan,
            'tongSoDonHangDaBanTuan' => $tongSoDonHangDaBanTuan,
            'tongDoanhThuTuan' => $tongDoanhThuTuan,
        ];

        $tongSoLuongSanPhamDaBanThang = DB::table('don_hang_chi_tiet')
            ->join('don_hang', 'don_hang.id', '=', 'don_hang_chi_tiet.id_don_hang')
            ->where('don_hang.trang_thai', 'hoan_thanh')
            ->whereYear('don_hang.created_at', Carbon::now()->year)
            ->whereMonth('don_hang.created_at', Carbon::now()->month)
            ->sum('don_hang_chi_tiet.so_luong');

        $tongSoDonHangDaBanThang = DonHang::where('trang_thai', 'hoan_thanh')
            ->whereYear('created_at', Carbon::now()->year)
            ->whereMonth('created_at', Carbon::now()->month)
            ->count();

        $tongDoanhThuThang = DonHang::where('trang_thai', 'hoan_thanh')
            ->whereYear('created_at', Carbon::now()->year)
            ->whereMonth('created_at', Carbon::now()->month)
            ->sum('tong_tien_hang');

        $tongTatCaDoanhThuThang = [
            'tongSoLuongSanPhamDaBanThang' => $tongSoLuongSanPhamDaBanThang,
            'tongSoDonHangDaBanThang' => $tongSoDonHangDaBanThang,
            'tongDoanhThuThang' => $tongDoanhThuThang,
        ];

        $tongSoLuongSanPhamDaBanNam = DB::table('don_hang_chi_tiet')
            ->join('don_hang', 'don_hang.id', '=', 'don_hang_chi_tiet.id_don_hang')
            ->where('don_hang.trang_thai', 'hoan_thanh')
            ->whereYear('don_hang.created_at', Carbon::now()->year)
            ->sum('don_hang_chi_tiet.so_luong');

        $tongSoDonHangDaBanNam = DonHang::where('trang_thai', 'hoan_thanh')
            ->whereYear('created_at', Carbon::now()->year)
            ->count();

        $tongDoanhThuNam = DonHang::where('trang_thai', 'hoan_thanh')
            ->whereYear('created_at', Carbon::now()->year)
            ->sum('tong_tien_hang');

        $tongTatCaDoanhThuNam = [
            'tongSoLuongSanPhamDaBanNam' => $tongSoLuongSanPhamDaBanNam,
            'tongSoDonHangDaBanNam' => $tongSoDonHangDaBanNam,
            'tongDoanhThuNam' => $tongDoanhThuNam,
        ];

        $listSanPhamMoiNhat = SanPham::orderBy('created_at', 'desc')->take(5)->get();

        $response['tongTatCaDoanhThu'] = $tongTatCaDoanhThu;
        $response['tongTatCaDoanhThuTuan'] = $tongTatCaDoanhThuTuan;
        $response['tongTatCaDoanhThuThang'] = $tongTatCaDoanhThuThang;
        $response['tongTatCaDoanhThuNam'] = $tongTatCaDoanhThuNam;
        $response['listSanPhamMoiNhat'] = $listSanPhamMoiNhat;

        return ApiResponse::responseObject($response);
    }
}
