<?php

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

Route::get('/statistics', [DonHangController::class, 'revenueStatistics']);
Route::get('/danh-sach-don-hang', [DonHangController::class, 'index']);
Route::put('/bills/status', [DonHangController::class, 'adminUpdateStatus']);
Route::get('/bills/{id}', [DonHangController::class, 'showAdmin']);

// client
Route::post('/bills', [DonHangController::class, 'clientStore']);
Route::get('/tracking-order', [DonHangController::class, 'showClient']);
Route::put('/bill/status/customer', [DonHangController::class, 'updateStatusCanceledByCustomer']);

Route::post('/bills/vn-pay/payment', [DonHangController::class, 're_vnpay_payment']);
Route::get('/bills/vn-pay/process-payment', [DonHangController::class, 'processPaymentBill']);

Route::put('/bill/payment-method', [DonHangController::class, 'updatePaymentMethodByCustomer']);
