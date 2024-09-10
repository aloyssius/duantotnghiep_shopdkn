<?php

namespace App\Constants;

class PaymentType
{
    const CASH = 'cash';
    const TRANSFER = 'transfer';

    public static function toArray(): array
    {
        return [
            self::CASH,
            self::TRANSFER,
        ];
    }
}
