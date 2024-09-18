<?php

use App\Http\Controllers\Api\Carts\CartController;
use App\Http\Controllers\GioHangController;
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

Route::post('/them-gio-hang-chi-tiet', [GioHangController::class, 'storeGioHangChiTiet']);
Route::delete('/xoa-gio-hang-chi-tiet/{id}', [GioHangController::class, 'xoaGioHangChiTiet']);
