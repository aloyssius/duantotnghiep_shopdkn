<?php

namespace App\Constants;

class VoucherStatus
{
    const DANG_DIEN_RA = 'dang_dien_ra';
    const SAP_DIEN_RA = 'sap_dien_ra';
    const DA_KET_THUC = 'da_ket_thuc';

    public static function toArray(): array
    {
        return [
            self::DANG_DIEN_RA,
            self::SAP_DIEN_RA,
            self::DA_KET_THUC,
        ];
    }
}
