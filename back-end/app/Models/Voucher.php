<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\SoftDeletes;

class Voucher extends BaseModel
{
    protected $table = 'voucher';

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

    public function __construct(array $attributes = [])
    {
        $this->fillable = array_merge(parent::getBaseFillable(), $this->fillable);
        parent::__construct($attributes);
    }

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
}
