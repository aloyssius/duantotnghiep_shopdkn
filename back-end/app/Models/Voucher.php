<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Voucher extends Model
{
    use HasUuids;

    protected $table = 'voucher';

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'ma',
        'mo_ta',
        'gia_tri',
        'dieu_kien_ap_dung',
        'luot_su_dung',
        'trang_thai',
        'ngay_bat_dau',
        'ngay_ket_thuc',
    ];

    protected $casts = [
        'gia_tri' => 'float',
    ];

    public function getNgayBatDauAttribute($value)
    {
        if ($value !== null) {
            return Carbon::parse($value)->format('H:i:s d-m-Y');
        }
        return null;
    }

    public function getNgayKetThucAttribute($value)
    {
        if ($value !== null) {
            return Carbon::parse($value)->format('H:i:s d-m-Y');
        }
        return null;
    }

    public function getCreatedAtAttribute($value)
    {
        return Carbon::parse($value)->timezone('Asia/Ho_Chi_Minh')->format('H:i:s d-m-Y');
    }
}
