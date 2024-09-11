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
use App\Http\Resources\SanPhamResource;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Color;
use App\Models\Image;
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

    public function show($id)
    {
        $timSanPham = SanPham::find($id);
        return ApiResponse::responseObject(new SanPhamResource($timSanPham));
    }

    public function updateStatus(ProductRequestBody $req)
    {
        $product = Product::find($req->id);

        if (!$product) {
            throw new NotFoundException("Không tìm thấy sản phẩm có id là " . $req->id);
        }

        $product->status = $req->statusProduct;
        $product->update();

        $products = Product::getProducts($req);

        $statusCounts = Product::select(DB::raw('count(status) as count, status'))
            ->groupBy('status')
            ->get();

        $response['products'] = $products['data'];
        $response['statusCounts'] = $statusCounts;
        $response['totalPages'] = $products['totalPages'];

        return ApiResponse::responseObject($response);
    }

    public function update(ProductRequestBody $req)
    {

        $data = json_decode($req->data);
        $files = $req->file('files');

        $product = Product::find($data->id);

        if (!$product) {
            throw new NotFoundException("Không tìm thấy sản phẩm có id là " . $data->id);
        }

        if ($data->name !== $product->name) {
            $existingProduct = Product::where('name', '=', $data->name)->first();

            if ($existingProduct) {
                throw new RestApiException("Tên sản phẩm này tồn tại!");
            }
        }

        if ($data->code !== $product->code) {
            $existingProduct = Product::where('code', '=', $data->code)->first();

            if ($existingProduct) {
                throw new RestApiException("Mã sản phẩm này tồn tại!");
            }
        }

        DB::beginTransaction();

        try {
            $product->code = $data->code;
            $product->name = $data->name;
            $product->status = $data->status;
            $product->description = $data->description;
            $product->brand_id = $data->brandId;
            $product->update();

            ProductCategory::where('product_id', $data->id)->delete();

            foreach ($data->categoryIds as $categoryId) {
                $newProductCategory = new ProductCategory();
                $newProductCategory->category_id = $categoryId;
                $newProductCategory->product_id = $product->id;
                $newProductCategory->save();
            }

            if (count($data->productItemsNeedRemove) > 0) {
                ProductDetails::whereIn('id', $data->productItemsNeedRemove)->delete();
            }

            foreach ($data->productItems as $productItem) {
                if (property_exists($productItem, 'id')) {
                    $findProductItem = ProductDetails::find($productItem->id);
                    $findProductItem->sku = $productItem->sku;
                    $findProductItem->price = $productItem->price;
                    $findProductItem->quantity = $productItem->quantity;
                    $findProductItem->status = $productItem->status;
                    $findProductItem->update();
                } else {
                    $newProductItem = new ProductDetails();
                    $newProductItem->sku = $productItem->sku;
                    $newProductItem->color_id = $productItem->colorId;
                    $newProductItem->size_id = $productItem->sizeId;
                    $newProductItem->price = $productItem->price;
                    $newProductItem->quantity = $productItem->quantity;
                    $newProductItem->status = $productItem->status;
                    $newProductItem->product_id = $data->id;
                    $newProductItem->save();
                }
            }

            if (count($data->imagesNeedRemove) > 0) {
                Image::whereIn('id', $data->imagesNeedRemove)->delete();

                foreach ($data->imagesCloudNeedRemove as $publicId) {
                    Cloudinary::destroy($publicId);
                }
            }

            foreach ($data->images as $image) {
                if (property_exists($image, 'id')) {
                    $findImage = Image::find($image->id);
                    $findImage->is_default = $image->isDefault;
                    $findImage->update();
                }
            }

            if (isset($files) && count($files) > 0) {
                $client = new Client();
                $cloudName = 'dgupbx2im';
                $uploadPreset = 'ml_default';
                foreach ($files as $file) {

                    $promises[] = $client->postAsync("https://api.cloudinary.com/v1_1/{$cloudName}/image/upload", [
                        'multipart' => [
                            [
                                'name' => 'file',
                                'contents' => fopen($file->getRealPath(), 'r'),
                            ],
                            [
                                'name' => 'upload_preset',
                                'contents' => $uploadPreset,
                            ],
                            [
                                'name' => 'folder',
                                'contents' => 'products',
                            ],
                        ],
                    ]);
                };

                $results = Utils::unwrap($promises);
                foreach ($results as $index => $result) {
                    $response = json_decode($result->getBody(), true);
                    $url = $response['secure_url'];

                    $image = $data->imagesNeedCreate[$index];

                    $newImage = new Image();
                    $newImage->path_url = $url;
                    $newImage->is_default = $image->isDefault;
                    $newImage->public_id = $response['public_id'];
                    $newImage->product_color_id = $image->colorId;
                    $newImage->product_id = $data->id;
                    $newImage->save();
                }
            }

            DB::commit();
        } catch (\Exception  $e) {
            DB::rollback();
            throw new RestApiException($e->getMessage());
        }

        $response = $this->findById($data->id);

        return ApiResponse::responseObject($response);
    }

    private function findById($id)
    {

        $product = Product::find($id);

        if (!$product) {
            throw new NotFoundException("Không tìm thấy sản phẩm có id là " . $id);
        }

        // categories
        $productCategoryIds = ProductCategory::where('product_id', $id)->pluck('category_id');
        $categories = Category::whereIn('id', $productCategoryIds)->get();

        // product_details
        $productItems = ProductDetails::where('product_id', '=', $id)->get();

        // colors
        $colorIds = ProductDetails::where('product_id', $id)->pluck('color_id')->unique();
        $colors = Color::whereIn('id', $colorIds->toArray())->get();

        // sizes
        $sizeIds = ProductDetails::where('product_id', $id)->pluck('size_id')->unique();
        $sizes = Size::whereIn('id', $sizeIds->toArray())->get();

        // prices unique
        $colorPrices = ProductDetails::where('product_id', $id)->pluck('price', 'color_id');

        // images
        $images = Image::where('product_id', $id)->get();

        // variants
        $variants = $colors->map(function ($item, $key) use ($colorPrices, $productItems, $sizes, $images) {
            $price = $colorPrices->get($item->id, null);

            $colorImages = $images->filter(function ($image) use ($item) {
                return $image->product_color_id == $item->id;
            });

            return [
                'key' => 0,
                'colorId' => $item->id,
                'colorName' => $item->name,
                'price' => ConvertHelper::formatCurrencyVnd($price),
                'images' => ImageResource::collection($colorImages),
                'imageFiles' => ImageResource::collection($colorImages),
                'variantItems' => $productItems->map(function ($productItem, $key) use ($sizes, $item) {

                    if ($item->id === $productItem->color_id) {
                        $size = collect($sizes)->first(function ($size) use ($productItem) {
                            return $size->id === $productItem->size_id;
                        });

                        return [
                            'id' => $productItem->id,
                            'sku' => $productItem->sku,
                            'colorId' => $productItem->color_id,
                            'sizeId' => $productItem->size_id,
                            'price' => ConvertHelper::formatCurrencyVnd($productItem->price),
                            'quantity' => ConvertHelper::formatNumberString($productItem->quantity),
                            'status' => $productItem->status,
                            'sizeName' => $size->name,
                        ];
                    }

                    return null;
                })->filter()->values(),
            ];
        })->values();

        $response = new ProductDetailResource($product);
        $response['categories'] = AttributeResource::collection($categories);
        $response['colors'] = AttributeResource::collection($colors);
        $response['sizes'] = AttributeResource::collection($sizes);
        $response['variants'] = $variants;

        return $response;
    }
}
