<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class TaiKhoan extends Model
{
    use HasUuids; //tự sinh id

    protected $table = 'tai_khoan';

    public $incrementing = false; //tắt tự tăng của id

    protected $keyType = 'string';

    protected $fillable = [
        'ma',
        'ho_va_ten',
        'ngay_sinh',
        'so_dien_thoai',
        'mat_khau',
        'email',
        'gioi_tinh',
        'trang_thai',
        'vai_tro',
    ];

    protected $casts = [
        'gioi_tinh' => 'integer',
    ];

    protected $hidden = [
        'mat_khau',
    ];

    public function getNgaySinhAttribute($value)
    {
        if ($value !== null) {
            return Carbon::parse($value)->format('d-m-Y');
        }
        return null;
    }
}
