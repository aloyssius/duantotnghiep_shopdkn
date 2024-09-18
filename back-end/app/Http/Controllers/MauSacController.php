<?php

namespace App\Http\Controllers;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Exceptions\NotFoundException;
use App\Models\MauSac;
use Illuminate\Http\Request;
use App\Http\Resources\MauSacResource;

class MauSacController extends Controller
{

    public function index(Request $req)
    {

        $mauSac = MauSac::query();

        if ($req->filled('tuKhoa')) {
            $tuKhoa = '%' . $req->tuKhoa . '%';
            $mauSac->where(function ($query) use ($tuKhoa) {
                $query->where('ma', 'like', $tuKhoa)
                    ->orWhere('ten', 'like', $tuKhoa);
            });
        }


        $mauSac->orderBy('ten', 'asc');

        // Phân trang
        // $response = $mauSac->paginate($req->pageSize, ['*'], 'currentPage', $req->currentPage);
        $response = $mauSac->paginate(10, ['*'], 'currentPage', $req->currentPage);
        // $response = $query->paginate($req->input('pageSize', 15), ['*'], 'currentPage', $req->input('currentPage', 1));

        return ApiResponse::responsePage(MauSacResource::collection($response));
    }

    public function show($id)
    {
        $mauSac = MauSac::find($id);
        if (!$mauSac) {
            throw new NotFoundException("Không tìm thấy màu sắc có id là " . $id);
        }

        return ApiResponse::responseObject(new MauSacResource($mauSac));
    }

    public function store(Request $req)
    {

        // Tạo một đối tượng MauSac mới từ dữ liệu đã được xác thực
        $mauSac = new MauSac();
        $mauSac->ma = $req->input('maMauSac'); // Đảm bảo mã mới được gán cho trường ma
        $mauSac->ten = $req->input('tenMauSac');
        $mauSac->trang_thai = 'dang_hoat_dong';

        // Lưu đối tượng TaiKhoan vào cơ sở dữ liệu
        $mauSac->save();

        // Trả về phản hồi với dữ liệu khách hàng mới được tạo
        return ApiResponse::responseObject(new MauSacResource($mauSac));
    }

    public function update(Request $req, $id)
    {
        $mauSac = MauSac::find($id);
        if (!$mauSac) {
            throw new NotFoundException("Không tìm thấy màu sắc có id là " . $id);
        }
        $mauSac->ten = $req->input('tenMauSac', $mauSac->ten);
        $mauSac->ma = $req->input('maMauSac', $mauSac->ma);
        $mauSac->trang_thai = $req->input('trangThai', $mauSac->trang_thai);

        // Lưu các thay đổi vào cơ sở dữ liệu
        $mauSac->save();

        // Trả về dữ liệu khách hàng đã cập nhật dưới dạng JSON
        return ApiResponse::responseObject(new MauSacResource($mauSac));
    }
}
