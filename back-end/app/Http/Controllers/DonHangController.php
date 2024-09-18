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
            $donHangChiTiet->don_gia = $timSanPham->don_gia;
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
            $donHangChiTiet->don_gia = $timSanPham->don_gia;
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
            $donHangChiTiet->don_gia = $timSanPham->don_gia;
            $donHangChiTiet->ten = $timSanPham->ten;
            $donHangChiTiet->ma = $timSanPham->ma;
        });

        $timDonHang['listDonHangChiTiet'] = $listDonHangChiTiet;

        return ApiResponse::responseObject(new DonHangChiTietResource($timDonHang));
    }

    public function thongKe(Request $req)
    {
        $startDate = $req->startDate;
        $endDate = $req->endDate;

        $totalBill = Bill::join('bill_details', 'bills.id', '=', 'bill_details.bill_id')
            ->whereBetween('bills.created_at', [
                Carbon::createFromFormat('d-m-Y', $startDate)->startOfDay(),
                Carbon::createFromFormat('d-m-Y', $endDate)->endOfDay()
            ])
            ->where('bills.status', OrderStatus::COMPLETED)
            ->selectRaw('SUM(bills.total_money - COALESCE(bills.discount_amount, 0)) as totalMoney')
            ->selectRaw('COUNT(bills.id) as totalOrder')
            ->selectRaw('SUM(bill_details.quantity) as totalSold')
            ->first();

        $totalStatus = Bill::whereIn('status', [OrderStatus::COMPLETED, OrderStatus::CANCELED])
            ->whereBetween('created_at', [
                Carbon::createFromFormat('d-m-Y', $startDate)->startOfDay(),
                Carbon::createFromFormat('d-m-Y', $endDate)->endOfDay()
            ])
            ->selectRaw('COUNT(*) as count, status')
            ->groupBy('status')
            ->get();
        $completedCount = $totalStatus->where('status', 'completed')->first()->count ?? 0;
        $canceledCount = $totalStatus->where('status', 'canceled')->first()->count ?? 0;
        $totalCountBillCompletedAndCanceled = $completedCount + $canceledCount;

        $totalStatusPercent = DB::table('bills')
            ->whereIn('status', [OrderStatus::COMPLETED, OrderStatus::CANCELED])
            ->whereBetween('created_at', [
                Carbon::createFromFormat('d-m-Y', $startDate)->startOfDay(),
                Carbon::createFromFormat('d-m-Y', $endDate)->endOfDay()
            ])
            ->selectRaw('
        status,
        COUNT(*) AS count,
        ROUND(COUNT(*) * 100.0 / (
            SELECT COUNT(*)
            FROM bills
            WHERE status IN (\'completed\', \'canceled\')
            AND created_at BETWEEN ? AND ?
        ), 2) AS percentage
    ', [
                Carbon::createFromFormat('d-m-Y', $startDate)->startOfDay(),
                Carbon::createFromFormat('d-m-Y', $endDate)->endOfDay()
            ])
            ->groupBy('status')
            ->get();
        //     $totalStatusPercent = DB::table('bills')
        //         ->whereIn('status', [OrderStatus::COMPLETED, OrderStatus::CANCELED])
        //         ->selectRaw('
        //     status,
        //     COUNT(*) AS count,
        //     ROUND(COUNT(*) * 100.0 / (
        //         SELECT COUNT(*)
        //         FROM bills
        //         WHERE status IN (\'completed\', \'canceled\')
        //     ), 2) AS percentage
        // ')
        //         ->groupBy('status')
        //         ->get();

        $query = "
            WITH PRODUCT_DEFAULT_IMAGE AS (
              SELECT PRODUCT_ID, path_url, PRODUCT_COLOR_ID
              FROM IMAGES
              WHERE IS_DEFAULT = 1
            )
            SELECT PD.sku as code, P.name, C.name as colorName, PDI.path_url as pathUrl, sum(BD.quantity) as totalSold
            FROM BILL_DETAILS BD
            JOIN BILLS B ON BD.BILL_ID = B.ID
            JOIN PRODUCT_DETAILS PD ON BD.PRODUCT_DETAILS_ID = PD.ID
            JOIN COLORS C ON PD.COLOR_ID = C.ID
            JOIN PRODUCTS P ON PD.PRODUCT_ID = P.ID
            JOIN PRODUCT_DEFAULT_IMAGE PDI ON PD.PRODUCT_ID = PDI.PRODUCT_ID
            AND PD.COLOR_ID = PDI.PRODUCT_COLOR_ID
            WHERE B.status = 'completed'
            group by pd.sku, p.name, PDI.path_url, c.name
            order by sum(BD.quantity) desc
            limit 5;
        ";
        $products = DB::select($query);

        $revenueByMonth = DB::table('bills as b')
            ->join('bill_details as bd', 'b.id', '=', 'bd.bill_id')
            // ->whereYear('b.created_at', 2024)
            ->where('b.status', 'completed')
            ->selectRaw('MONTH(b.created_at) as month, YEAR(b.created_at) as year, SUM((bd.quantity * bd.price) - COALESCE(b.discount_amount, 0)) as totalRevenue')
            ->groupBy('month', 'year')
            ->orderBy('month')
            ->get();

        $response['totalBill'] = $totalBill;
        $response['totalCount'] = $totalCountBillCompletedAndCanceled;
        $response['totalPercent'] = $totalStatusPercent;
        $response['products'] = $products;
        $response['revenueByMonth'] = $revenueByMonth;

        return ApiResponse::responseObject($response);
    }
}
