<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class MauSac extends Model
{
    use HasUuids;

    public $incrementing = false;

    protected $keyType = 'string';

    protected $table = 'mau_sac';

    protected $fillable = [
        'ma_mau_sac',
        'ten_mau_sac',
        'trang_thai',
    ];

    public function getCreatedAtAttribute($value)
    {
        return Carbon::parse($value)->timezone('Asia/Ho_Chi_Minh')->format('H:i:s d-m-Y');
    }
}
