<?php

use App\Common\BaseBlueprint;
use App\Constants\BillHistoryStatusTimeline;
use App\Constants\CommonStatus;
use App\Constants\ConstantSystem;
use App\Constants\DiscountStatus;
use App\Constants\OrderStatus;
use App\Constants\OrderType;
use App\Constants\ProductStatus;
use App\Constants\Role;
use App\Constants\TransactionType;
use App\Constants\VoucherTypeDiscount;
use App\Constants\VoucherType;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // tạo schema để tạo bảng
        $schema = DB::connection()->getSchemaBuilder();

        // sử dụng $table của class BaseBluePrint
        $schema->blueprintResolver(function ($table, $callback) {
            return new BaseBlueprint($table, $callback);
        });

        $schema->create('vai_tro', function (BaseBlueprint $table) {
            $table->baseColumn();
            $table->string('ten', ConstantSystem::DEFAULT_MAX_LENGTH);
            $table->enum('ma', Role::toArray())->unique();
        });

        $schema->create('tai_khoan', function (BaseBlueprint $table) {
            $table->baseColumn();
            $table->string('ma', ConstantSystem::CODE_MAX_LENGTH)->unique();
            $table->string('ho_va_ten', ConstantSystem::FULL_NAME_MAX_LENGTH)->nullable();
            $table->dateTime('ngay_sinh')->nullable();
            $table->string('so_dien_thoai', ConstantSystem::PHONE_NUMBER_MAX_LENGTH)->nullable();
            $table->string('mat_khau', ConstantSystem::DEFAULT_MAX_LENGTH)->nullable();
            $table->string('email', ConstantSystem::EMAIL_MAX_LENGTH)->nullable();
            $table->boolean('gioi_tinh')->nullable();
            $table->enum('trang_thai', CommonStatus::toArray())->default(CommonStatus::IS_ACTIVE);
            $table->foreignUuid('id_vai_tro')->references('id')->on('vai_tro');
        });

        // $schema->create('addresses', function (BaseBlueprint $table) {
        //     $table->baseColumn();
        //     $table->string('full_name', ConstantSystem::FULL_NAME_MAX_LENGTH);
        //     $table->string('address', ConstantSystem::ADDRESS_MAX_LENGTH);
        //     $table->string('phone_number', ConstantSystem::PHONE_NUMBER_MAX_LENGTH);
        //     $table->string('province_id');
        //     $table->string('district_id');
        //     $table->string('ward_code');
        //     $table->boolean('is_default')->default(false);
        //     $table->foreignUuid('account_id')->references('id')->on('accounts');
        // });


        $schema->create('voucher', function (BaseBlueprint $table) {
            $table->baseColumn();
            $table->string('ma', ConstantSystem::CODE_MAX_LENGTH)->unique();
            $table->string('mo_ta', ConstantSystem::DEFAULT_MAX_LENGTH);
            $table->bigDecimal('gia_tri');
            $table->bigDecimal('dieu_kien_ap_dung');
            $table->enum('trang_thai', DiscountStatus::toArray());
            $table->integer('luot_su_dung')->default(0);
            $table->timestamp('ngay_bat_dau');
            $table->timestamp('ngay_ket_thuc');
        });

        $schema->create('gio_hang', function (BaseBlueprint $table) {
            $table->baseColumn();
            $table->uuid('account_id')->unique();
        });

        $schema->create('danh_muc', function (BaseBlueprint $table) {
            $table->baseColumn();
            $table->string('ma', ConstantSystem::CODE_MAX_LENGTH)->unique();
            $table->string('ten', ConstantSystem::DEFAULT_MAX_LENGTH)->nullable();
            $table->enum('trang_thai', CommonStatus::toArray())->default(CommonStatus::IS_ACTIVE);
        });

        $schema->create('mau_sac', function (BaseBlueprint $table) {
            $table->baseColumn();
            $table->string('ma', ConstantSystem::CODE_MAX_LENGTH)->unique();
            $table->string('ten', ConstantSystem::DEFAULT_MAX_LENGTH)->nullable();
            $table->enum('trang_thai', CommonStatus::toArray())->default(CommonStatus::IS_ACTIVE);
        });

        $schema->create('thuong_hieu', function (BaseBlueprint $table) {
            $table->baseColumn();
            $table->string('ma', ConstantSystem::CODE_MAX_LENGTH)->unique();
            $table->string('ten', ConstantSystem::DEFAULT_MAX_LENGTH)->nullable();
            $table->enum('trang_thai', CommonStatus::toArray())->default(CommonStatus::IS_ACTIVE);
        });

        $schema->create('san_pham', function (BaseBlueprint $table) {
            $table->baseColumn();
            $table->string('ma', ConstantSystem::CODE_MAX_LENGTH)->unique();
            $table->string('ten', ConstantSystem::DEFAULT_MAX_LENGTH)->nullable();
            $table->enum('trang_thai', ProductStatus::toArray())->default(CommonStatus::IS_ACTIVE);
            $table->text('mo_ta')->nullable();
            $table->bigDecimal('don_gia');
            $table->foreignUuid('id_thuong_hieu')->references('id')->on('thuong_hieu');
            $table->foreignUuid('id_danh_muc')->references('id')->on('danh_muc');
            $table->foreignUuid('id_mau_sac')->references('id')->on('mau_sac');
        });

        $schema->create('kich_co', function (BaseBlueprint $table) {
            $table->baseColumn();
            $table->string('ten', ConstantSystem::DEFAULT_MAX_LENGTH)->nullable();
            $table->enum('trang_thai', CommonStatus::toArray())->default(CommonStatus::IS_ACTIVE);
            $table->integer('so_luong_ton')->default(0);
            $table->foreignUuid('id_san_pham')->references('id')->on('san_pham');
        });

        $schema->create('gio_hang_chi_tiet', function (BaseBlueprint $table) {
            $table->baseColumn();
            $table->integer('so_luong');
            $table->foreignUuid('id_gio_hang')->references('id')->on('gio_hang');
            $table->foreignUuid('id_san_pham')->references('id')->on('san_pham');
        });

        $schema->create('don_hang', function (BaseBlueprint $table) {
            $table->baseColumn();
            $table->string('ma', ConstantSystem::DEFAULT_MAX_LENGTH)->unique();
            $table->timestamp('ngay_huy_don')->nullable();
            $table->timestamp('ngay_giao_hang')->nullable();
            $table->timestamp('ngay_hoan_thanh')->nullable();
            $table->enum('trang_thai', OrderStatus::toArray())->default(OrderStatus::PENDING_COMFIRM);
            $table->enum('hinh_thuc_thanh_toan', TransactionType::toArray());
            $table->string('ho_va_ten', ConstantSystem::FULL_NAME_MAX_LENGTH);
            $table->string('email', ConstantSystem::EMAIL_MAX_LENGTH);
            $table->string('dia_chi', ConstantSystem::ADDRESS_MAX_LENGTH);
            $table->string('so_dien_thoai', ConstantSystem::PHONE_NUMBER_MAX_LENGTH);
            $table->bigDecimal('tien_ship');
            $table->bigDecimal('tong_tien_hang');
            $table->bigDecimal('so_tien_giam');
            $table->foreignUuid('id_tai_khoan')->nullable()->references('id')->on('tai_khoan');
            $table->foreignUuid('id_voucher')->nullable()->references('id')->on('voucher');
        });

        $schema->create('don_hang_chi_tiet', function (BaseBlueprint $table) {
            $table->baseColumn();
            $table->bigDecimal('don_gia');
            $table->integer('so_luong');
            $table->foreignUuid('id_don_hang')->references('id')->on('don_hang');
            $table->foreignUuid('id_san_pham')->references('id')->on('san_pham');
        });

        $schema->create('lich_su_don_hang', function (BaseBlueprint $table) {
            $table->baseColumn();
            $table->enum('trang_thai', BillHistoryStatusTimeline::toArray());
            $table->string('ghi_chu', ConstantSystem::DEFAULT_MAX_LENGTH);
            $table->string('thao_tac', ConstantSystem::DEFAULT_MAX_LENGTH);
            $table->foreignUuid('id_don_hang')->references('id')->on('don_hang');
        });

        $schema->create('lich_su_thanh_toan', function (BaseBlueprint $table) {
            $table->baseColumn();
            $table->bigDecimal('tong_tien');
            $table->string('ma_giao_dich', ConstantSystem::CODE_MAX_LENGTH)->unique()->nullable();
            $table->foreignUuid('id_don_hang')->references('id')->on('don_hang');
        });

        $schema->create('hinh_anh', function (BaseBlueprint $table) {
            $table->baseColumn();
            $table->string('duong_dan_url', ConstantSystem::URL_MAX_LENGTH);
            $table->string('public_id', ConstantSystem::URL_MAX_LENGTH);
            $table->boolean('anh_mac_dinh')->default(false);
            $table->foreignUuid('id_san_pham')->references('id')->on('san_pham');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vai_tro');
        Schema::dropIfExists('danh_muc');
        Schema::dropIfExists('thuong_hieu');
        Schema::dropIfExists('kich_co');
        Schema::dropIfExists('mau_sac');
        Schema::dropIfExists('don_hang');
        Schema::dropIfExists('don_hang_chi_tiet');
        Schema::dropIfExists('lich_su_don_hang');
        Schema::dropIfExists('lich_su_thanh_toan');
        // Schema::dropIfExists('addresses');
        Schema::dropIfExists('tai_khoan');
        Schema::dropIfExists('voucher');
        Schema::dropIfExists('gio_hang');
        Schema::dropIfExists('gio_hang_chi_tiet');
        Schema::dropIfExists('san_pham');
        Schema::dropIfExists('hinh_anh');
    }
};
