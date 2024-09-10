<?php

namespace App\Constants;

class OrderStatus
{
    const CHO_XAC_NHAN = 'cho_xac_nhan';
    const CHO_GIAO_HANG = 'cho_giao_hang';
    const DANG_GIAO_HANG = 'dang_giao_hang';
    const HOAN_THANH = 'hoan_thanh';
    const DA_HUY = 'da_huy';

    public static function toArray(): array
    {
        return [
            self::CHO_XAC_NHAN,
            self::CHO_GIAO_HANG,
            self::DANG_GIAO_HANG,
            self::HOAN_THANH,
            self::DA_HUY,
        ];
    }
}
