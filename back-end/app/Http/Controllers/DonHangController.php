<?php

namespace App\Http\Controllers;

use App\Constants\BillHistoryStatusTimeline;
use App\Constants\ConstantSystem;
use App\Constants\OrderStatus;
use App\Constants\Role as ConstantsRole;
use App\Constants\TransactionType;
use App\Exceptions\NotFoundException;
use App\Exceptions\RestApiException;
use App\Exceptions\VNPayException;
use App\Helpers\ApiResponse;
use App\Helpers\CustomCodeHelper;
use App\Helpers\QueryHelper;
use App\Http\Controllers\Controller;
use App\Http\Requests\Bill\BillRequest;
use App\Http\Requests\Bill\BillRequestBody;
use App\Http\Resources\Accounts\AccountResource;
use App\Http\Resources\Bills\BillDetailEmailResource;
use App\Http\Resources\Bills\BillDetailResource;
use App\Http\Resources\Bills\BillResource;
use App\Http\Resources\Bills\HistoryResource;
use App\Http\Resources\Bills\PaymentResource;
use App\Http\Resources\DonHangResource;
use App\Jobs\SendEmailPlaceOrderSuccess;
use App\Mail\PlaceOrderSuccessEmail;
use App\Models\Account;
use App\Models\Bill;
use App\Models\BillDetails;
use App\Models\BillHistory;
use App\Models\CartDetails;
use App\Models\DonHang;
use App\Models\Notification;
use App\Models\ProductDetails;
use App\Models\Role;
use App\Models\Transaction;
use App\Models\Voucher;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;

class DonHangController extends Controller
{
    public function index(Request $req)
    {

        $listDonHang = DonHang::query();

        // tìm kiếm theo từ khóa
        if ($req->filled('tuKhoa')) {
            $tuKhoa = '%' . $req->tuKhoa . '%';
            $listDonHang->where(function ($query) use ($tuKhoa) {
                $query->where('ho_va_ten', 'like', $tuKhoa)
                    ->orWhere('ma', 'like', $tuKhoa)
                    ->orWhere('so_dien_thoai', 'like', $tuKhoa);
            });
        }

        // lọc theo trạng thái
        if ($req->filled('trangThai')) {
            $listDonHang->where('trang_thai', $req->trangThai);
        }

        // lọc theo khoảng ngày
        $listDonHang->when($req->filled('tuNgay') && $req->filled('denNgay'), function ($query) use ($req) {
            // lọc từ ngày đến ngày
            $tuNgay = Carbon::parse($req->tuNgay)->startOfDay();
            $denNgay = Carbon::parse($req->denNgay)->endOfDay();
            return $query->whereBetween('created_at', [$tuNgay, $denNgay]);
        })
            // lọc từ ngày trở đi
            ->when($req->filled('tuNgay') && !$req->filled('denNgay'), function ($query) use ($req) {
                $tuNgay = Carbon::parse($req->tuNgay)->startOfDay();
                $query->where('created_at', '>=', $tuNgay);
            })

            // lọc đến ngày trở về
            ->when(!$req->filled('tuNgay') && $req->filled('denNgay'), function ($query) use ($req) {
                $denNgay = Carbon::parse($req->denNgay)->endOfDay();
                $query->where('created_at', '<=', $denNgay);
            });

        // sắp xếp đơn hàng mới nhất
        $listDonHang->orderBy('created_at', 'desc');

        // phân trang
        $response = $listDonHang->paginate(10, ['*'], 'currentPage', $req->currentPage);

        return ApiResponse::responsePage(DonHangResource::collection($response));
    }

    public function showAdmin($id)
    {
        $bill = Bill::find($id);

        if (!$bill) {
            throw new NotFoundException("Không tìm thấy đơn hàng");
        }

        $bill = $this->getBillDetail($bill);

        return ApiResponse::responseObject(new BillDetailResource($bill));
    }

    public function adminUpdateStatus(BillRequestBody $req)
    {
        $bill = Bill::find($req->id);

        if (!$bill) {
            throw new NotFoundException("Không tìm thấy đơn hàng");
        }

        if ($bill->status === OrderStatus::CANCELED) {
            throw new RestApiException("Đơn hàng đã được hủy bỏ từ trước đó");
        }

        try {
            DB::beginTransaction();

            $statusTimeline = $req->status;

            if ($statusTimeline === BillHistoryStatusTimeline::WAITTING_DELIVERY) {
                $billHistory = new BillHistory();
                $billHistory->bill_id = $bill->id;
                $billHistory->status_timeline = $statusTimeline;
                $billHistory->action = $req->actionTimeline['action'];
                $billHistory->note = $req->actionTimeline['note'];
                $billHistory->created_by = $req->createdBy;
                $billHistory->save();
            } else if ($statusTimeline === BillHistoryStatusTimeline::DELYVERING) {
                $findTimeline = BillHistory::where('status_timeline', BillHistoryStatusTimeline::WAITTING_DELIVERY)->where('bill_id', $bill->id)->first();
                $bill->delivery_date = now();
                $bill->save();

                if ($findTimeline) {
                    $billHistory = new BillHistory();
                    $billHistory->bill_id = $bill->id;
                    $billHistory->status_timeline = $statusTimeline;
                    $billHistory->action = $req->actionTimeline['action'];
                    $billHistory->note = $req->actionTimeline['note'];
                    $billHistory->created_by = $req->createdBy;
                    $billHistory->save();
                } else {
                    $created_at = Carbon::now();
                    $billHistory = new BillHistory();
                    $billHistory->bill_id = $bill->id;
                    $billHistory->status_timeline = $statusTimeline;
                    $billHistory->action = $req->actionTimeline['action'];
                    $billHistory->note = $req->actionTimeline['note'];
                    $billHistory->created_at = $created_at;
                    $billHistory->created_by = $req->createdBy;
                    $billHistory->save();

                    $created_atWaitingDelivery = Carbon::parse($created_at)->subSeconds(1);
                    $billHistoryWaitingDelivery = new BillHistory();
                    $billHistoryWaitingDelivery->bill_id = $bill->id;
                    $billHistoryWaitingDelivery->status_timeline = BillHistoryStatusTimeline::WAITTING_DELIVERY;
                    $billHistoryWaitingDelivery->action = "Đang chuẩn bị hàng";
                    $billHistoryWaitingDelivery->note = "Người gửi đang chuẩn bị hàng";
                    $billHistoryWaitingDelivery->created_at = $created_atWaitingDelivery;
                    $billHistoryWaitingDelivery->created_by = $req->createdBy;
                    $billHistoryWaitingDelivery->save();
                }
            } else if ($statusTimeline === BillHistoryStatusTimeline::COMPLETED) {
                $bill->completion_date = now();
                $bill->save();

                $billHistory = new BillHistory();
                $billHistory->bill_id = $bill->id;
                $billHistory->status_timeline = $statusTimeline;
                $billHistory->action = $req->actionTimeline['action'];
                $billHistory->note = $req->actionTimeline['note'];
                $billHistory->created_by = $req->createdBy;
                $billHistory->save();

                if ($bill->payment_method === TransactionType::CASH) {
                    $billPayment = new Transaction();
                    $billPayment->type = TransactionType::CASH;
                    $billPayment->total_money = $req->totalFinal;
                    $billPayment->bill_id = $bill->id;
                    $billPayment->created_by = $req->createdBy;
                    $billPayment->save();
                }
            } else {

                $billHistory = new BillHistory();
                $billHistory->bill_id = $bill->id;
                $billHistory->status_timeline = $statusTimeline;
                $billHistory->action = $req->action;
                $billHistory->note = $req->note;
                $billHistory->created_by = $req->createdBy;
                $billHistory->save();

                $bill->cancellation_date = now();

                $billItems = BillDetails::where('bill_id', $bill->id)->get();

                foreach ($billItems as $item) {

                    $findProductItem = ProductDetails::find($item->product_details_id);

                    if ($findProductItem) {
                        $findProductItem->quantity = $findProductItem->quantity + $item->quantity;
                        $findProductItem->save();
                    }
                }
            }

            $bill->status = $req->status;
            $bill->save();

            DB::commit();
        } catch (\Exception $e) {
            DB::rollback();
            throw new RestApiException($e->getMessage());
            // throw new RestApiException("Thêm sản phẩm vào giỏ hàng không thành công");
        }


        $bill = $this->getBillDetail($bill);

        return ApiResponse::responseObject(new BillDetailResource($bill));
    }

    public function getBillDetail($bill)
    {
        $billHistories = BillHistory::select(
            'bill_histories.id',
            'bill_histories.created_at',
            'bill_histories.note',
            'bill_histories.status_timeline',
            'bill_histories.action',
            'accounts.full_name',
            'accounts.code',
            'roles.name as role'
        )
            ->leftJoin('accounts', 'bill_histories.created_by', '=', 'accounts.id')
            ->leftJoin('roles', 'accounts.role_id', '=', 'roles.id')
            ->where('bill_histories.bill_id', $bill->id)
            ->orderBy('bill_histories.created_at', 'asc')
            ->get();
        $billPayment = Transaction::select(
            'transactions.id',
            'transactions.created_at',
            'transactions.total_money',
            'transactions.trading_code',
            'transactions.type',
            'accounts.full_name',
            'accounts.code',
            'roles.name as role'
        )
            ->leftJoin('accounts', 'transactions.created_by', '=', 'accounts.id')
            ->leftJoin('roles', 'accounts.role_id', '=', 'roles.id')
            ->where('bill_id', $bill->id)
            ->first();
        $billItems = BillDetails::getBillItemsByBillId($bill->id);

        if ($bill->customer_id) {
            $account = Account::find($bill->customer_id);

            if ($account) {
                $bill->account = new AccountResource($account);
            }
        }

        $bill->histories = HistoryResource::collection($billHistories);
        $bill->payment = new PaymentResource($billPayment);
        $bill->billItems = $billItems;

        return $bill;
    }

    public function revenueStatistics(Request $req)
    {
        $startDate = $req->startDate;
        $endDate = $req->endDate;

        $totalBill = Bill::join('bill_details', 'bills.id', '=', 'bill_details.bill_id')
            ->whereBetween('bills.created_at', [
                Carbon::createFromFormat('d-m-Y', $startDate)->startOfDay(),
                Carbon::createFromFormat('d-m-Y', $endDate)->endOfDay()
            ])
            ->where('bills.status', OrderStatus::COMPLETED)
            ->selectRaw('SUM(bills.total_money - COALESCE(bills.discount_amount, 0)) as totalMoney')
            ->selectRaw('COUNT(bills.id) as totalOrder')
            ->selectRaw('SUM(bill_details.quantity) as totalSold')
            ->first();

        $totalStatus = Bill::whereIn('status', [OrderStatus::COMPLETED, OrderStatus::CANCELED])
            ->whereBetween('created_at', [
                Carbon::createFromFormat('d-m-Y', $startDate)->startOfDay(),
                Carbon::createFromFormat('d-m-Y', $endDate)->endOfDay()
            ])
            ->selectRaw('COUNT(*) as count, status')
            ->groupBy('status')
            ->get();
        $completedCount = $totalStatus->where('status', 'completed')->first()->count ?? 0;
        $canceledCount = $totalStatus->where('status', 'canceled')->first()->count ?? 0;
        $totalCountBillCompletedAndCanceled = $completedCount + $canceledCount;

        $totalStatusPercent = DB::table('bills')
            ->whereIn('status', [OrderStatus::COMPLETED, OrderStatus::CANCELED])
            ->whereBetween('created_at', [
                Carbon::createFromFormat('d-m-Y', $startDate)->startOfDay(),
                Carbon::createFromFormat('d-m-Y', $endDate)->endOfDay()
            ])
            ->selectRaw('
        status,
        COUNT(*) AS count,
        ROUND(COUNT(*) * 100.0 / (
            SELECT COUNT(*)
            FROM bills
            WHERE status IN (\'completed\', \'canceled\')
            AND created_at BETWEEN ? AND ?
        ), 2) AS percentage
    ', [
                Carbon::createFromFormat('d-m-Y', $startDate)->startOfDay(),
                Carbon::createFromFormat('d-m-Y', $endDate)->endOfDay()
            ])
            ->groupBy('status')
            ->get();
        //     $totalStatusPercent = DB::table('bills')
        //         ->whereIn('status', [OrderStatus::COMPLETED, OrderStatus::CANCELED])
        //         ->selectRaw('
        //     status,
        //     COUNT(*) AS count,
        //     ROUND(COUNT(*) * 100.0 / (
        //         SELECT COUNT(*)
        //         FROM bills
        //         WHERE status IN (\'completed\', \'canceled\')
        //     ), 2) AS percentage
        // ')
        //         ->groupBy('status')
        //         ->get();

        $query = "
            WITH PRODUCT_DEFAULT_IMAGE AS (
              SELECT PRODUCT_ID, path_url, PRODUCT_COLOR_ID
              FROM IMAGES
              WHERE IS_DEFAULT = 1
            )
            SELECT PD.sku as code, P.name, C.name as colorName, PDI.path_url as pathUrl, sum(BD.quantity) as totalSold
            FROM BILL_DETAILS BD
            JOIN BILLS B ON BD.BILL_ID = B.ID
            JOIN PRODUCT_DETAILS PD ON BD.PRODUCT_DETAILS_ID = PD.ID
            JOIN COLORS C ON PD.COLOR_ID = C.ID
            JOIN PRODUCTS P ON PD.PRODUCT_ID = P.ID
            JOIN PRODUCT_DEFAULT_IMAGE PDI ON PD.PRODUCT_ID = PDI.PRODUCT_ID
            AND PD.COLOR_ID = PDI.PRODUCT_COLOR_ID
            WHERE B.status = 'completed'
            group by pd.sku, p.name, PDI.path_url, c.name
            order by sum(BD.quantity) desc
            limit 5;
        ";
        $products = DB::select($query);

        $revenueByMonth = DB::table('bills as b')
            ->join('bill_details as bd', 'b.id', '=', 'bd.bill_id')
            // ->whereYear('b.created_at', 2024)
            ->where('b.status', 'completed')
            ->selectRaw('MONTH(b.created_at) as month, YEAR(b.created_at) as year, SUM((bd.quantity * bd.price) - COALESCE(b.discount_amount, 0)) as totalRevenue')
            ->groupBy('month', 'year')
            ->orderBy('month')
            ->get();

        $response['totalBill'] = $totalBill;
        $response['totalCount'] = $totalCountBillCompletedAndCanceled;
        $response['totalPercent'] = $totalStatusPercent;
        $response['products'] = $products;
        $response['revenueByMonth'] = $revenueByMonth;

        return ApiResponse::responseObject($response);
    }
}
