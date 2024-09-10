<?php

namespace App\Constants;

class CommonStatus
{
    const DANG_HOAT_DONG = 'dang_hoat_dong';
    const NGUNG_HOAT_DONG = 'ngung_hoat_dong';

    public static function toArray(): array
    {
        return [
            self::DANG_HOAT_DONG,
            self::NGUNG_HOAT_DONG,
        ];
    }
}
