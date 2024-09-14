<?php

use App\Http\Controllers\Api\Accounts\CustomerController;
use App\Http\Controllers\Api\Accounts\EmployeeController;
use App\Http\Controllers\Api\Bills\BillController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\TaiKhoanController;
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


// admin
Route::post('/login', [AuthController::class, 'loginAdmin']);

// admin
Route::get('/customers', [CustomerController::class, 'index']);
Route::post('/customers', [CustomerController::class, 'store']);
Route::put('/customers', [CustomerController::class, 'update']);
Route::get('/customers/{id}', [CustomerController::class, 'show']);

Route::get('/customers/address/{id}', [CustomerController::class, 'show']);
Route::post('/customers/address/', [CustomerController::class, 'storeAddress']);
Route::get('/customers/{id}/address', [CustomerController::class, 'index']);

Route::get('/employees', [EmployeeController::class, 'index']);
Route::post('/employees', [EmployeeController::class, 'store']);
Route::put('/employees', [EmployeeController::class, 'update']);
Route::get('/employees/{id}', [EmployeeController::class, 'show']);

Route::get('/employees/address/{id}', [EmployeeController::class, 'show']);
Route::post('/employees/address/', [EmployeeController::class, 'storeAddress']);
Route::get('/employees/{id}/address', [EmployeeController::class, 'index']);

// client
Route::post('/dang-nhap', [TaiKhoanController::class, 'dangNhap']);
Route::post('/dang-ky', [TaiKhoanController::class, 'dangKy']);
Route::get('/lich-su-mua-hang', [TaiKhoanController::class, 'showLichSuMuaHang']);
