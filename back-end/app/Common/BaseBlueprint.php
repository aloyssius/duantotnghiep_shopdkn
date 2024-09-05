<?php

namespace App\Common;

use App\Constants\ConstantSystem;
use Illuminate\Database\Schema\Blueprint;

class BaseBlueprint extends Blueprint
{
    public function baseColumn()
    {
        $this->uuid('id')->primary();
        $this->timestamps(); // created_at, updated_at
        $this->uuid('created_by')->nullable();
        $this->uuid('updated_by')->nullable();

        return $this;
    }

    public function bigDecimal(string $colunmName)
    {
        $this->decimal($colunmName, 15, 2)->default(0);
    }
}
