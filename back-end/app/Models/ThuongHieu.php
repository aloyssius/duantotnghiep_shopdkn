<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class ThuongHieu extends Model
{
    use HasUuids;

    public $incrementing = false;

    protected $keyType = 'string';

    protected $table = 'thuong_hieu';

    protected $fillable = [
        'ma',
        'ten',
        'trang_thai',
    ];

    public function getCreatedAtAttribute($value)
    {
        return Carbon::parse($value)->timezone('Asia/Ho_Chi_Minh')->format('H:i:s d-m-Y');
    }
}
