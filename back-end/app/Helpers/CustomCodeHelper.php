<?php

namespace App\Helpers;

class CustomCodeHelper
{
    public static function taoMa($model, $ma)
    {
        $ketQua = $ma;

        $modelMoiNhat = $model->orderBy('created_at', 'desc')->first();
        if ($modelMoiNhat) {
            $chuSo = substr($modelMoiNhat->ma, 2); // vi du: 'KH0007' -> '0007'
            $chuSoMoi = str_pad((int) $chuSo + 1, 4, '0', STR_PAD_LEFT); // -> '0008'
            $ketQua = $ketQua . $chuSoMoi; // 'KH0008'
        } else {
            $ketQua = $ketQua . '0001';
        }

        return $ketQua;
    }
}
