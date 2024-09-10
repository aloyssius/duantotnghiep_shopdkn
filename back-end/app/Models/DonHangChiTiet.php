<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class DonHangChiTiet extends Model
{
    use HasUuids;

    public $incrementing = false;

    protected $keyType = 'string';

    protected $table = 'don_hang_chi_tiet';

    protected $fillable = [
        'so_luong',
        'don_gia',
        'id_san_pham',
        'id_don_hang',
    ];

    protected $casts = [
        'don_gia' => 'float',
    ];

    public static function getBillItemsByBillId($id)
    {
        $query = "
            WITH PRODUCT_DEFAULT_IMAGE AS (
              SELECT PRODUCT_ID, path_url, PRODUCT_COLOR_ID
              FROM IMAGES
              WHERE IS_DEFAULT = 1
            )
            SELECT BD.id as billDetailId, PD.id, PD.sku, P.name, BD.price, C.name as colorName, PDI.path_url as pathUrl, S.name as sizeName, PD.quantity as stock, BD.quantity, BD.created_at as createdAt
            FROM BILL_DETAILS BD
            JOIN BILLS B ON BD.BILL_ID = B.ID
            JOIN PRODUCT_DETAILS PD ON BD.PRODUCT_DETAILS_ID = PD.ID
            JOIN PRODUCTS P ON PD.PRODUCT_ID = P.ID
            JOIN COLORS C ON PD.COLOR_ID = C.ID
            JOIN SIZES S ON PD.SIZE_ID = S.ID
            JOIN PRODUCT_DEFAULT_IMAGE PDI ON PD.PRODUCT_ID = PDI.PRODUCT_ID
            AND PD.COLOR_ID = PDI.PRODUCT_COLOR_ID
            AND B.ID = '$id'
            ORDER BY BD.CREATED_AT DESC
        ";

        $billItems = DB::select($query);
        $convertedBillItems = BillDetails::hydrate($billItems);

        foreach ($convertedBillItems as $billItems) {
            $sizes = ProductDetails::select('product_details.quantity', 'product_details.id', 'sizes.name', 'product_details.status')
                ->where('product_details.sku', $billItems->sku)
                // ->where('product_details.status', 'is_active')
                ->join('sizes', 'product_details.size_id', '=', 'sizes.id')
                ->orderBy('sizes.name', 'asc')
                ->get();
            $billItems->sizes = $sizes;
        }

        return $convertedBillItems;
    }

    public function __construct(array $attributes = [])
    {
        $this->fillable = array_merge(parent::getBaseFillable(), $this->fillable);
        parent::__construct($attributes);
    }
}
