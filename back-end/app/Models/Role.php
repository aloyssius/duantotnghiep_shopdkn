<?php

namespace App\Models;

class Role extends BaseModel
{
    protected $table = 'vai_tro';

    protected $fillable = [
        'ma',
        'ten',
    ];

    public function __construct(array $attributes = [])
    {
        $this->fillable = array_merge(parent::getBaseFillable(), $this->fillable);
        parent::__construct($attributes);
    }
}
