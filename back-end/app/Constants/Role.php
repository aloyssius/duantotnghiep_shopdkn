<?php

namespace App\Constants;

class Role
{
    const ADMIN = 'admin';
    const NHAN_VIEN = 'nhan_vien';
    const KHACH_HANG = 'khach_hang';

    public static function toArray(): array
    {
        return [
            self::ADMIN,
            self::NHAN_VIEN,
            self::KHACH_HANG,
        ];
    }
}
