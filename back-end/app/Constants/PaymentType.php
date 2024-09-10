<?php

namespace App\Constants;

class PaymentType
{
    const TIEN_MAT = 'tien_mat';
    const CHUYEN_KHOAN = 'chuyen_khoan';

    public static function toArray(): array
    {
        return [
            self::TIEN_MAT,
            self::CHUYEN_KHOAN,
        ];
    }
}
