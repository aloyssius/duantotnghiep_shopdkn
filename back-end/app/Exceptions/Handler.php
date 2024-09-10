<?php

namespace App\Exceptions;

use App\Constants\ConstantSystem;
use App\Helpers\ApiResponse;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Throwable;

class Handler extends ExceptionHandler
{
    /**
     * The list of the inputs that are never flashed to the session on validation exceptions.
     *
     * @var array<int, string>
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Register the exception handling callbacks for the application.
     */
    public function register(): void
    {
        $this->reportable(function (Throwable $e) {
            //
        });
    }

    public function render($request, Throwable $exception)
    {
        if ($exception instanceof NotFoundHttpException) {
            return ApiResponse::responseError(
                404,
                'end_point_not_found',
                'Đường dẫn api không tồn tại.'
            );
        } else if ($exception instanceof RestApiException) {
            return ApiResponse::responseError(
                400,
                'bad_request',
                $exception->getMessage(),
            );
        } else if ($exception instanceof NotFoundException) {
            return ApiResponse::responseError(
                404,
                'not_found',
                $exception->getMessage(),
            );
        } else if ($exception instanceof Exception) {
            return ApiResponse::responseError(
                500,
                'server_error',
                $exception->getMessage(),
            );
        }

        return parent::render($request, $exception);
    }
}
