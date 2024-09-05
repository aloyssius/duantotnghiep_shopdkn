<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\SoftDeletes;
use Tymon\JWTAuth\Contracts\JWTSubject;
use App\Models\Address;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Foundation\Auth\User as Authenticatable;

class Account extends BaseModel
{
    protected $table = 'tai_khoan';

    protected $fillable = [
        'ma',
        'ho_va_ten',
        'ngay_sinh',
        'so_dien_thoai',
        'mat_khau',
        'email',
        'gioi_tinh',
        'trang_thai',
        'id_vai_tro',
    ];

    protected $casts = [
        'gioi_tinh' => 'integer',
    ];

    protected $hidden = [
        'password',
    ];

    public function getNgaySinhAttribute($value)
    {
        if ($value !== null) {
            return Carbon::parse($value)->format('d-m-Y');
        }
        return null;
    }
}
