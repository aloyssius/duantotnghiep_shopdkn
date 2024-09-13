<?php

use App\Http\Controllers\Api\Products\AttributeBrandController;
use App\Http\Controllers\Api\Products\AttributeCategoryController;
use App\Http\Controllers\Api\Products\AttributeColorController;
use App\Http\Controllers\Api\Products\AttributeSizeController;
use App\Http\Controllers\Api\Products\ProductController;
use App\Http\Controllers\SanPhamClientController;
use App\Http\Controllers\SanPhamController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/


// client
Route::get('/danh-sach-san-pham-client', [SanPhamClientController::class, 'index']);

Route::get('/product-list', [ProductController::class, 'clientIndex']);
Route::get('/product-list/male', [ProductController::class, 'clientIndexMale']);
Route::get('/product-list/female', [ProductController::class, 'clientIndexFemale']);
Route::get('/product-details/{sku}', [ProductController::class, 'findBySkuClient']);
Route::get('/product-detail/{id}', [ProductController::class, 'findByClientId']);
Route::get('/product-home', [ProductController::class, 'indexHomeClient']);

// admin
Route::get('/danh-sach-san-pham', [SanPhamController::class, 'index']);
Route::get('/danh-sach-thuoc-tinh', [SanPhamController::class, 'indexThuocTinhSanPham']);
Route::post('/them-san-pham', [SanPhamController::class, 'store']);
Route::post('/them-kich-co', [SanPhamController::class, 'storeKichCo']);
Route::post('/them-hinh-anh', [SanPhamController::class, 'storeHinhAnh']);
Route::put('/trang-thai-kich-co', [SanPhamController::class, 'updateTrangThaiChoKichCo']);
Route::put('/so-luong-ton', [SanPhamController::class, 'updateSoLuongTonChoKichCo']);
Route::get('/tim-san-pham/{id}', [SanPhamController::class, 'show']);
Route::put('/update-san-pham', [SanPhamController::class, 'updateSanPham']);

// color
Route::get('/attributes/colors', [AttributeColorController::class, 'index']);
Route::put('/attributes/colors/status', [AttributeColorController::class, 'updateStatus']);
Route::put('/attributes/colors', [AttributeColorController::class, 'update']);
Route::post('/attributes/colors', [AttributeColorController::class, 'store']);
Route::delete('/attributes/colors', [AttributeColorController::class, 'destroy']);

// brand
Route::get('/attributes/brands', [AttributeBrandController::class, 'index']);
Route::put('/attributes/brands/status', [AttributeBrandController::class, 'updateStatus']);
Route::put('/attributes/brands', [AttributeBrandController::class, 'update']);
Route::post('/attributes/brands', [AttributeBrandController::class, 'storeBrand']);
Route::delete('/attributes/brands', [AttributeBrandController::class, 'destroy']);
