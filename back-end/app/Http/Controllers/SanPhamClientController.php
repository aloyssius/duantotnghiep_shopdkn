<?php

namespace App\Http\Controllers;

use App\Constants\CommonStatus;
use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Resources\SanPhamClientResource;
use App\Http\Resources\SanPhamResource;
use App\Models\HinhAnh;
use App\Models\KichCo;
use App\Models\SanPham;
use App\Models\ThuongHieu;
use Illuminate\Http\Request;

class SanPhamClientController extends Controller
{

    public function index(Request $req)
    {
        // Khởi tạo truy vấn
        $query = SanPham::where('trang_thai', CommonStatus::DANG_HOAT_DONG)->orderBy('created_at', 'desc');

        // Kiểm tra xem có tham số idThuongHieu trong yêu cầu không
        if ($req->filled('idThuongHieu')) {
            $query->where('id_thuong_hieu', $req->idThuongHieu);
        }

        // Lấy danh sách sản phẩm
        $listSanPham = $query->get()->map(function ($sanPham) {
            // Lấy hình ảnh đại diện
            $hinhDaiDien = HinhAnh::where('id_san_pham', $sanPham->id)->first();

            // Thêm hình ảnh đại diện vào sản phẩm
            $sanPham->hinhAnh = $hinhDaiDien ? $hinhDaiDien->duong_dan_url : null;

            return $sanPham;
        });

        $response['listSanPham'] = SanPhamClientResource::collection($listSanPham); //dữ liệu trả về api
        $response['listThuongHieu'] = ThuongHieu::all();

        return ApiResponse::responseObject($response);
    }

    public function show($ma)
    {
        $timSanPham = SanPham::where('ma', $ma)->first();

        $listHinhAnh = HinhAnh::where('id_san_pham', $timSanPham->id)->pluck('duong_dan_url');

        $listKichCo =  KichCo::where('id_san_pham', $timSanPham->id)->select('id', 'ten_kich_co as ten', 'so_luong_ton as soLuong')->orderBy('ten_kich_co', 'asc')->get();

        $timSanPham['listHinhAnh'] = $listHinhAnh;
        $timSanPham['listKichCo'] = $listKichCo;

        return ApiResponse::responseObject(new SanPhamResource($timSanPham));
    }
}
