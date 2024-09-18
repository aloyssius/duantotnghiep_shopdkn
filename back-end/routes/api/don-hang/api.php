<?php

use App\Http\Controllers\DonHangClientController;
use App\Http\Controllers\DonHangController;
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

Route::get('/thong-ke', [DonHangController::class, 'thongKe']);
Route::get('/danh-sach-don-hang', [DonHangController::class, 'index']);
Route::get('/tim-don-hang/{id}', [DonHangController::class, 'show']);
Route::put('/trang-thai-don-hang/{id}', [DonHangController::class, 'capNhatTrangThaiDonHang']);
Route::put('/huy-don-hang/{id}', [DonHangController::class, 'huyDonHang']);

// client
Route::post('/dat-hang', [DonHangClientController::class, 'storeDatHang']);
Route::get('/danh-sach-don-hang-cua-tai-khoan/{id}', [DonHangClientController::class, 'danhSachDonHangCuaTaiKhoan']);
Route::get('/chi-tiet-don-hang/{ma}', [DonHangClientController::class, 'chiTietDonHang']);
