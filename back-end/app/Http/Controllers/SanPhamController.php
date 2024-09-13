<?php

namespace App\Http\Controllers;

use App\Exceptions\RestApiException;
use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Resources\SanPhamResource;
use App\Models\HinhAnh;
use App\Models\KichCo;
use App\Models\MauSac;
use App\Models\SanPham;
use App\Models\ThuongHieu;
use Illuminate\Http\Request;

class SanPhamController extends Controller
{

    public function index(Request $req)
    {

        $listSanPham = SanPham::query();

        // tìm kiếm theo từ khóa
        if ($req->filled('tuKhoa')) {
            $tuKhoa = '%' . $req->tuKhoa . '%';
            $listSanPham->where(function ($query) use ($tuKhoa) {
                $query->where('ma', 'like', $tuKhoa)
                    ->orWhere('ten', 'like', $tuKhoa);
            });
        }

        // lọc theo trạng thái
        if ($req->filled('trangThai')) {
            $listSanPham->where('trang_thai', $req->trangThai);
        }

        // sắp xếp đơn hàng mới nhất
        $listSanPham->orderBy('created_at', 'desc');

        // phân trang
        $response = $listSanPham->paginate(10, ['*'], 'currentPage', $req->currentPage);

        return ApiResponse::responsePage(SanPhamResource::collection($response));
    }

    public function indexThuocTinhSanPham()
    {
        $listThuongHieu = ThuongHieu::select(['id', 'ten'])->get();
        $listMauSac = MauSac::select(['id', 'ten', 'ma'])->get();

        $response['listThuongHieu'] = $listThuongHieu;
        $response['listMauSac'] = $listMauSac;

        return ApiResponse::responseObject($response);
    }

    public function store(Request $req)
    {
        $maSanPhamTonTai = SanPham::where('ma', $req->maSanPham)->first();

        if ($maSanPhamTonTai) {
            throw new RestApiException('Mã đã tồn tại');
        }

        $sanPhamMoi = new SanPham();
        $sanPhamMoi->ma = $req->maSanPham;
        $sanPhamMoi->ten = $req->tenSanPham;
        $sanPhamMoi->trang_thai = $req->trangThai;
        $sanPhamMoi->don_gia = $req->donGia;
        $sanPhamMoi->mo_ta = $req->moTa;
        $sanPhamMoi->id_thuong_hieu = $req->idThuongHieu;
        $sanPhamMoi->id_mau_sac = $req->idMauSac;
        $sanPhamMoi->save();

        return ApiResponse::responseObject($sanPhamMoi);
    }

    public function storeHinhAnh(Request $req)
    {
        $hinhAnhMoi = new HinhAnh();
        $hinhAnhMoi->duong_dan_url = $req->hinhAnh;
        $hinhAnhMoi->id_san_pham = $req->id;
        $hinhAnhMoi->save();

        $listHinhAnhCuaSanPham = HinhAnh::where('id_san_pham', $req->id)->pluck('duong_dan_url');

        return ApiResponse::responseObject($listHinhAnhCuaSanPham);
    }

    public function storeKichCo(Request $req)
    {
        foreach ($req->listKichCo as $kichCo) {
            if (is_string($kichCo) && !empty($kichCo)) { // Kiểm tra nếu là chuỗi và không rỗng
                $kichCoMoi = new KichCo();
                $kichCoMoi->ten_kich_co = $kichCo;
                $kichCoMoi->id_san_pham = $req->id;
                $kichCoMoi->save();
            }
        }

        $listKichCoCuaSanPham = KichCo::where('id_san_pham', $req->id)->orderBy('ten_kich_co', 'asc')->get();

        return ApiResponse::responseObject($listKichCoCuaSanPham);
    }

    public function show($id)
    {
        $timSanPham = SanPham::find($id);

        $listKichCoCuaSanPham = KichCo::where('id_san_pham', $id)->orderBy('ten_kich_co', 'asc')->get();
        $timSanPham['listKichCo'] = $listKichCoCuaSanPham;

        $listHinhAnhCuaSanPham = HinhAnh::where('id_san_pham', $id)->pluck('duong_dan_url');
        $timSanPham['listHinhAnh'] = $listHinhAnhCuaSanPham;

        return ApiResponse::responseObject(new SanPhamResource($timSanPham));
    }

    public function updateSoLuongTonChoKichCo(Request $req)
    {
        $timKichCo = KichCo::find($req->id);

        if ($timKichCo) {
            $timKichCo->so_luong_ton = $req->soLuongTon;
            $timKichCo->save();
        }

        $listKichCoCuaSanPham = KichCo::where('id_san_pham', $req->idSanPham)->orderBy('ten_kich_co', 'asc')->get();

        return ApiResponse::responseObject($listKichCoCuaSanPham);
    }

    public function updateTrangThaiChoKichCo(Request $req)
    {
        $timKichCo = KichCo::find($req->id);

        if ($timKichCo) {
            $timKichCo->trang_thai = $req->trangThai;
            $timKichCo->save();
        }

        $listKichCoCuaSanPham = KichCo::where('id_san_pham', $req->idSanPham)->orderBy('ten_kich_co', 'asc')->get();

        return ApiResponse::responseObject($listKichCoCuaSanPham);
    }

    public function updateSanPham(Request $req)
    {
        $timSanPham = SanPham::find($req->id);

        if ($timSanPham) {

            if ($req->maSanPham !== $timSanPham->ma) {

                $maSanPhamTonTai = SanPham::where('ma', $req->maSanPham)->first();

                if ($maSanPhamTonTai) {
                    throw new RestApiException('Mã đã tồn tại');
                }
            }

            $timSanPham->ma = $req->maSanPham;
            $timSanPham->ten = $req->tenSanPham;
            $timSanPham->trang_thai = $req->trangThai;
            $timSanPham->don_gia = $req->donGia;
            $timSanPham->mo_ta = $req->moTa;
            $timSanPham->id_thuong_hieu = $req->idThuongHieu;
            $timSanPham->id_mau_sac = $req->idMauSac;
            $timSanPham->save();
        }

        return ApiResponse::responseObject($timSanPham);
    }
}
