<?php

namespace App\Http\Controllers;

use App\Helpers\ApiResponse;
use App\Helpers\QueryHelper;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use App\Exceptions\NotFoundException;
use App\Exceptions\RestApiException;
use App\Helpers\ConvertHelper;
use App\Helpers\CustomCodeHelper;
use App\Http\Requests\Product\AttributeRequest;
use App\Http\Requests\Product\AttributeRequestBody;
use App\Http\Resources\Products\AttributeResource;
use App\Models\Brand;
use App\Models\Product;
use App\Models\ThuongHieu;
use Illuminate\Http\Request;
use App\Http\Resources\ThuongHieuResource;

class ThuongHieuController extends Controller
{

    public function index(Request $req)
    {

        $thuongHieu = ThuongHieu::query();

        if ($req->filled('tuKhoa')) {
            $tuKhoa = '%' . $req->tuKhoa . '%';
            $thuongHieu->where(function ($query) use ($tuKhoa) {
                $query->where('ma', 'like', $tuKhoa)
                    ->orWhere('ten', 'like', $tuKhoa);
            });
        }
    
        // Sắp xếp theo ngày tạo
        $thuongHieu->orderBy('created_at', 'desc');
    
        // Phân trang
        // $response = $thuongHieu->paginate($req->pageSize, ['*'], 'currentPage', $req->currentPage);
        $response = $thuongHieu->paginate(10, ['*'], 'currentPage', $req->currentPage);
        // $response = $query->paginate($req->input('pageSize', 15), ['*'], 'currentPage', $req->input('currentPage', 1));
    
        return ApiResponse::responsePage(ThuongHieuResource::collection($response));

    }

    public function show($id)
    {
        $thuongHieu = ThuongHieu::find($id);
        if (!$thuongHieu) {
            throw new NotFoundException("Không tìm thấy thương hiệu có id là " . $id);
        }

        return ApiResponse::responseObject(new ThuongHieuResource($thuongHieu));
    }

    public function store(Request $req)
    {
        $maMoi = CustomCodeHelper::taoMa(ThuongHieu::query(), 'TH');

        // Tạo một đối tượng ThuongHieu mới từ dữ liệu đã được xác thực
        $thuongHieu = new ThuongHieu();
        $thuongHieu->ma = $maMoi; // Đảm bảo mã mới được gán cho trường ma
        $thuongHieu->ten = $req->input('tenThuongHieu');
        $thuongHieu->trang_thai = 'dang_hoat_dong';

        // Lưu đối tượng TaiKhoan vào cơ sở dữ liệu
        $thuongHieu->save();

        // Trả về phản hồi với dữ liệu khách hàng mới được tạo
        return ApiResponse::responseObject(new ThuongHieuResource($thuongHieu));
    }

    public function update(Request $req, $id)
    {
        $thuongHieu = ThuongHieu::find($id);
        if (!$thuongHieu) {
            throw new NotFoundException("Không tìm thấy thương hiệu có id là " . $id);
        }

            $thuongHieu->ten = $req->input('tenThuongHieu', $thuongHieu->ten);
            $thuongHieu->trang_thai = $req->input('trangThai', $thuongHieu->trang_thai);

            // Lưu các thay đổi vào cơ sở dữ liệu
            $thuongHieu->save();

            // Trả về dữ liệu khách hàng đã cập nhật dưới dạng JSON
            return ApiResponse::responseObject(new ThuongHieuResource($thuongHieu));
    }
}
