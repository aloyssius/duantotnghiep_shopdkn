<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class KichCo extends Model
{
    use HasUuids;

    public $incrementing = false;

    protected $keyType = 'string';

    protected $table = 'kich_co';

    protected $fillable = [
        'id_san_pham',
        'ten_kich_co',
        'so_luong_ton',
        'trang_thai',
    ];
}
