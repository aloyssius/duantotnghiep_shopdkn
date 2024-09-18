<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class DonHang extends Model
{
    use HasUuids;

    public $incrementing = false;

    protected $keyType = 'string';

    protected $table = 'don_hang';

    protected $fillable = [
        'ma',
        'ngay_giao_hang',
        'ngay_hoan_thanh',
        'ngay_huy_don',
        'ho_va_ten',
        'email',
        'dia_chi',
        'so_dien_thoai',
        'trang_thai',
        'tien_ship',
        'tong_tien_hang',
        'id_tai_khoan',
    ];

    protected $casts = [
        'tien_ship' => 'float',
        'tong_tien_hang' => 'float',
    ];

    public function getNgayHuyDonAttribute($value)
    {
        if ($value !== null) {
            return Carbon::parse($value)->format('H:i:s d/m/Y');
        }
        return null;
    }

    public function getNgayGiaoHangAttribute($value)
    {
        if ($value !== null) {
            return Carbon::parse($value)->format('H:i:s d/m/Y');
        }
        return null;
    }

    public function getNgayHoanThanhAttribute($value)
    {
        if ($value !== null) {
            return Carbon::parse($value)->format('H:i:s d/m/Y');
        }
        return null;
    }

    public function getCreatedAtAttribute($value)
    {
        if ($value !== null) {
            return Carbon::parse($value)->format('H:i:s d/m/Y');
        }
        return null;
    }
}
