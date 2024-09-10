<?php

namespace App\Helpers;

use Illuminate\Support\Facades\DB;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Support\Facades\Log;

use function PHPUnit\Framework\isEmpty;

class ApiResponse
{

    public static function responseObject($data, $message = '', $code = 200)
    {
        $showSql = DB::getQueryLog();

        $response = [
            'success' => true,
            'status' => $code,
            'data'    => $data,
            'sql' => $showSql,
        ];
        if (!empty($message)) {
            $response['message'] = $message;
        }
        return response()->json($response, $code);
    }

    public static function responsePage($page, $otherData = [], $message = '', $code = 200)
    {
        $showSql = DB::getQueryLog();

        $response = [
            'success' => true,
            'status' => $code,
            'data'    => $page->items(),
            'page' => [
                'currentPage' => $page->currentPage(),
                'totalPages' => $page->lastPage(),
                'pageSize' => $page->perPage(),
                'totalElements' => $page->total(),
            ],
            'sql' => $showSql,

        ];
        if (!empty($message)) {
            $response['message'] = $message;
        }

        if ($otherData) {
            $response['otherData'] = $otherData;
        }

        return response()->json($response, $code);
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
