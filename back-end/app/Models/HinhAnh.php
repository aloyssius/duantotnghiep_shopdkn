<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class HinhAnh extends Model
{
    use HasUuids;

    public $incrementing = false;

    protected $keyType = 'string';

    protected $table = 'hinh_anh';

    protected $fillable = [
        'id_san_pham',
        'duong_dan_url',
        'anh_mac_dinh',
    ];
}
