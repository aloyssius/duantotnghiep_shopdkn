<?php

namespace App\Http\Controllers;

use App\Constants\CommonStatus;
use App\Constants\ProductStatus;
use App\Exceptions\NotFoundException;
use App\Exceptions\RestApiException;
use App\Helpers\ApiResponse;
use App\Helpers\ConvertHelper;
use App\Helpers\CustomCodeHelper;
use App\Http\Controllers\Controller;
use App\Http\Requests\Product\AttributeRequestBody;
use App\Http\Requests\Product\ProductRequest;
use App\Http\Requests\Product\ProductRequestBody;
use App\Http\Resources\Products\AttributeResource;
use App\Http\Resources\Products\ImageResource;
use App\Http\Resources\Products\ProductDetailResource;
use App\Http\Resources\SanPhamClientResource;
use App\Http\Resources\SanPhamResource;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Color;
use App\Models\HinhAnh;
use App\Models\Image;
use App\Models\KichCo;
use App\Models\MauSac;
use App\Models\Product;
use App\Models\ProductCategory;
use App\Models\ProductDetails;
use App\Models\SanPham;
use App\Models\Size;
use App\Models\ThuongHieu;
use Cloudinary\Api\ApiClient;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;
use Illuminate\Support\Facades\DB;
use GuzzleHttp\Client;
use GuzzleHttp\Promise\Utils;
use Illuminate\Http\Request;

class SanPhamClientController extends Controller
{

    public function indexHomeClient()
    {
        $productNews = ProductDetails::getClientProductHome();
        $productTopSold = ProductDetails::getClientProductTopSold();

        $response['new'] = $productNews;
        $response['topSold'] = $productTopSold;

        return ApiResponse::responseObject($response);
    }

    public function index(Request $req)
    {
        // Khởi tạo truy vấn
        $query = SanPham::where('trang_thai', CommonStatus::DANG_HOAT_DONG);

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

        $response['listSanPham'] = SanPhamClientResource::collection($listSanPham);
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

    public function findByClientId($id)
    {
        $productDetail = ProductDetails::getClientProductDetailById($id)->first();

        if (!$productDetail) {
            throw new NotFoundException("Không tìm thấy sản phẩm này!");
        }

        // if ($productDetail->stock <= 0) {
        //     throw new RestApiException("Sản phẩm tạm hết hàng");
        // }

        $productDetail['quantity'] = 1;
        $productActiveStatus = 'is_active';

        $sizes = ProductDetails::select('product_details.quantity', 'product_details.id', 'sizes.name', 'product_details.status')
            ->where('product_details.sku', $productDetail->sku)
            ->where('product_details.status', $productActiveStatus)
            ->join('sizes', 'product_details.size_id', '=', 'sizes.id')
            ->orderBy('sizes.name', 'asc')
            ->get();
        $productDetail['sizes'] = $sizes;


        return ApiResponse::responseObject($productDetail);
    }

    public function top8ProductNew(ProductRequest $req)
    {
        $req->pageSize = 8;
        $productDetails = ProductDetails::getClientProducts($req);

        return ApiResponse::responsePageCustom($productDetails);
    }

    public function top8ProductHot(ProductRequest $req)
    {
        $req->pageSize = 8;
        $productDetails = ProductDetails::getClientProducts($req);

        return ApiResponse::responsePageCustom($productDetails);
    }
}
