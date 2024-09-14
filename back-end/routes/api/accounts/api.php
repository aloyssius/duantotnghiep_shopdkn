<?php

use App\Http\Controllers\TaiKhoanController;
use App\Http\Controllers\KhachHangController;
use App\Http\Controllers\NhanVienController;
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
Route::post('/dang-nhap', [TaiKhoanController::class, 'dangNhap']);
Route::post('/dang-ky', [TaiKhoanController::class, 'dangKy']);
Route::get('/lich-su-mua-hang', [TaiKhoanController::class, 'showLichSuMuaHang']);

// client
Route::get('/khach-hang', [KhachHangController::class, 'index']);
Route::post('/khach-hang', [KhachHangController::class, 'store']);
Route::get('khach-hang/{id}', [KhachHangController::class, 'show']);
Route::put('khach-hang/{id}', [KhachHangController::class, 'update']);

Route::get('/nhan-vien', [NhanVienController::class, 'index']);
Route::post('/nhan-vien', [NhanVienController::class, 'store']);
Route::get('nhan-vien/{id}', [NhanVienController::class, 'show']);
Route::put('nhan-vien/{id}', [NhanVienController::class, 'update']);


// Route::get('/account/bills', [BillController::class, 'showBillsByAccount']);
// Route::get('/account/bill-detail', [BillController::class, 'showBillDetailByAccount']);
// Route::put('/account/bill/status', [BillController::class, 'updateStatusCanceledByAccount']);
// Route::put('/account/bill/payment-method', [BillController::class, 'updatePaymentMethodByAccount']);