<?php

namespace App\Helpers;

use Illuminate\Support\Facades\DB;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Support\Facades\Log;

use function PHPUnit\Framework\isEmpty;

class ApiResponse
{

    public static function responseObject($data)
    {
        $showSql = DB::getQueryLog();

        $response = [
            'data'    => $data,
            'sql' => $showSql,
        ];
        return response()->json($response, 200);
    }

    public static function responsePage($page, $otherData = [])
    {
        $showSql = DB::getQueryLog();

        $response = [
            'data'    => $page->items(),
            'page' => [
                'currentPage' => $page->currentPage(),
                'totalPages' => $page->lastPage(),
                'pageSize' => $page->perPage(),
                'totalElements' => $page->total(),
            ],
            'sql' => $showSql,

        ];

        if ($otherData) {
            $response['otherData'] = $otherData;
        }

        return response()->json($response, 200);
    }

    public static function responseError($code = 500, $error = '', $message = '')
    {
        $response = [
            'status' => $code,
            'error' => $error,
            'message'    => $message,
        ];
        return response()->json($response, $code);
    }
}
