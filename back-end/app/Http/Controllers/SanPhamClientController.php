<?php

namespace App\Http\Controllers;

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
use App\Http\Resources\Products\SanPhamResource;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Color;
use App\Models\Image;
use App\Models\Product;
use App\Models\ProductCategory;
use App\Models\ProductDetails;
use App\Models\SanPham;
use App\Models\Size;
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

    public function clientIndexMale(ProductRequest $req)
    {
        $req->pageSize = 15;
        $productDetails = ProductDetails::getClientProducts($req, 'male');

        $brands = Brand::select(['id', 'name'])->orderBy('created_at', 'desc')->get();
        $categories = Category::select(['id', 'name'])->orderBy('created_at', 'desc')->get();
        $colors = Color::select(['id', 'code', 'name'])->orderBy('created_at', 'desc')->get();
        $sizes = Size::select(['id', 'name'])->orderBy('name', 'asc')->get();

        $otherData['brands'] = $brands;
        $otherData['categories'] = $categories;
        $otherData['colors'] = $colors;
        $otherData['sizes'] = $sizes;

        return ApiResponse::responsePageCustom($productDetails, [], $otherData);
    }
    public function clientIndexFemale(ProductRequest $req)
    {
        $req->pageSize = 15;
        $productDetails = ProductDetails::getClientProducts($req, 'female');

        $brands = Brand::select(['id', 'name'])->orderBy('created_at', 'desc')->get();
        $categories = Category::select(['id', 'name'])->orderBy('created_at', 'desc')->get();
        $colors = Color::select(['id', 'code', 'name'])->orderBy('created_at', 'desc')->get();
        $sizes = Size::select(['id', 'name'])->orderBy('name', 'asc')->get();

        $otherData['brands'] = $brands;
        $otherData['categories'] = $categories;
        $otherData['colors'] = $colors;
        $otherData['sizes'] = $sizes;

        return ApiResponse::responsePageCustom($productDetails, [], $otherData);
    }

    public function clientIndex(ProductRequest $req)
    {
        $req->pageSize = 15;
        $productDetails = ProductDetails::getClientProducts($req);

        $brands = Brand::select(['id', 'name'])->orderBy('created_at', 'desc')->get();
        $categories = Category::select(['id', 'name'])->orderBy('created_at', 'desc')->get();
        $colors = Color::select(['id', 'code', 'name'])->orderBy('created_at', 'desc')->get();
        $sizes = Size::select(['id', 'name'])->orderBy('name', 'asc')->get();

        $otherData['brands'] = $brands;
        $otherData['categories'] = $categories;
        $otherData['colors'] = $colors;
        $otherData['sizes'] = $sizes;

        return ApiResponse::responsePageCustom($productDetails, [], $otherData);
    }

    public function findBySkuClient($sku)
    {
        $product = Product::select('PRODUCTS.name', 'BRANDS.NAME as brandName', 'COLORS.NAME as colorName', 'PRODUCTS.status', 'PRODUCT_DETAILS.price', 'PRODUCT_DETAILS.sku', 'PRODUCTS.ID as productId', 'COLORS.ID as colorId', 'PRODUCTS.description')
            ->join('PRODUCT_DETAILS', 'PRODUCTS.ID', '=', 'PRODUCT_DETAILS.PRODUCT_ID')
            ->join('BRANDS', 'PRODUCTS.BRAND_ID', '=', 'BRANDS.ID')
            ->join('COLORS', 'PRODUCT_DETAILS.COLOR_ID', '=', 'COLORS.ID')
            ->where('PRODUCT_DETAILS.SKU', $sku)
            ->groupBy('PRODUCTS.NAME', 'BRANDS.NAME', 'COLORS.NAME', 'PRODUCTS.STATUS', 'PRODUCT_DETAILS.PRICE', 'PRODUCT_DETAILS.SKU', 'PRODUCTS.ID', 'COLORS.ID')
            ->first();

        if (!$product) {
            throw new NotFoundException("Không tìm thấy sản phẩm này!");
        }

        if ($product->status !== ProductStatus::IS_ACTIVE) {
            throw new NotFoundException("Không tìm thấy sản phẩm này!");
        }

        // colors
        $colors = ProductDetails::select('product_details.color_id as colorId', 'product_details.sku', 'colors.name', 'colors.code')
            ->where('product_details.product_id', $product->productId)
            ->join('colors', 'product_details.color_id', '=', 'colors.id')
            ->groupBy('color_id', 'sku')
            ->get();

        // sizes
        $productActiveStatus = 'is_active';
        $sizes = ProductDetails::select('product_details.quantity', 'product_details.id', 'sizes.name', 'product_details.status')
            ->where('product_details.product_id', $product->productId)
            ->where('product_details.sku', $sku)
            ->where('product_details.status', $productActiveStatus)
            ->join('sizes', 'product_details.size_id', '=', 'sizes.id')
            ->orderBy('sizes.name', 'asc')
            ->get();

        // images
        $images = Image::select('path_url as pathUrl', 'is_default as isDefault')->where('product_id', $product->productId)->where('product_color_id', $product->colorId)->get();

        $product['colors'] = $colors;
        $product['sizes'] = $sizes;
        $product['images'] = $images;

        return ApiResponse::responseObject($product);
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
