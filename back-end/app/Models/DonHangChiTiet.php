<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class DonHangChiTiet extends Model
{
    use HasUuids;

    public $incrementing = false;

    protected $keyType = 'string';

    protected $table = 'don_hang_chi_tiet';

    protected $fillable = [
        'so_luong',
        'don_gia',
        'id_san_pham',
        'id_don_hang',
    ];

    protected $casts = [
        'don_gia' => 'float',
    ];
}
