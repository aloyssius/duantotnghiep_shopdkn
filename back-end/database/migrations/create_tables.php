<?php

use App\Constants\CommonStatus;
use App\Constants\ConstantSystem;
use App\Constants\OrderStatus;
use App\Constants\Role;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tai_khoan', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->timestamps();
            $table->string('ma', ConstantSystem::CODE_MAX_LENGTH)->unique();
            $table->string('ho_va_ten', ConstantSystem::FULL_NAME_MAX_LENGTH)->nullable();
            $table->dateTime('ngay_sinh')->nullable();
            $table->string('so_dien_thoai', ConstantSystem::PHONE_NUMBER_MAX_LENGTH)->nullable();
            $table->string('mat_khau', ConstantSystem::DEFAULT_MAX_LENGTH)->nullable();
            $table->string('email', ConstantSystem::EMAIL_MAX_LENGTH)->nullable();
            $table->boolean('gioi_tinh')->nullable();
            $table->enum('trang_thai', CommonStatus::toArray())->default(CommonStatus::DANG_HOAT_DONG);
            $table->enum('vai_tro', Role::toArray());
        });

        Schema::create('gio_hang', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('id_tai_khoan')->unique();
            $table->timestamps();
        });

        Schema::create('mau_sac', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->timestamps();
            $table->string('ma', ConstantSystem::CODE_MAX_LENGTH)->unique();
            $table->string('ten', ConstantSystem::DEFAULT_MAX_LENGTH)->nullable();
            $table->enum('trang_thai', CommonStatus::toArray())->default(CommonStatus::DANG_HOAT_DONG);
        });

        Schema::create('thuong_hieu', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->timestamps();
            $table->string('ma', ConstantSystem::CODE_MAX_LENGTH)->unique();
            $table->string('ten', ConstantSystem::DEFAULT_MAX_LENGTH)->nullable();
            $table->enum('trang_thai', CommonStatus::toArray())->default(CommonStatus::DANG_HOAT_DONG);
        });

        Schema::create('san_pham', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->timestamps();
            $table->string('ma', ConstantSystem::CODE_MAX_LENGTH)->unique();
            $table->string('ten', ConstantSystem::DEFAULT_MAX_LENGTH)->nullable();
            $table->enum('trang_thai', CommonStatus::toArray())->default(CommonStatus::DANG_HOAT_DONG);
            $table->text('mo_ta')->nullable();
            $table->decimal('don_gia', 15, 2)->default(0);
            $table->foreignUuid('id_thuong_hieu')->references('id')->on('thuong_hieu');
            $table->foreignUuid('id_mau_sac')->references('id')->on('mau_sac');
        });

        Schema::create('kich_co', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('id_san_pham')->references('id')->on('san_pham');
            $table->string('ten_kich_co', ConstantSystem::DEFAULT_MAX_LENGTH)->nullable();
            $table->integer('so_luong_ton')->default(0);
            $table->enum('trang_thai', CommonStatus::toArray())->default(CommonStatus::DANG_HOAT_DONG);
            $table->timestamps();
        });

        Schema::create('gio_hang_chi_tiet', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->timestamps();
            $table->string('ten_kich_co', ConstantSystem::DEFAULT_MAX_LENGTH)->nullable();
            $table->integer('so_luong')->default(0);
            $table->foreignUuid('id_gio_hang')->references('id')->on('gio_hang');
            $table->foreignUuid('id_san_pham')->references('id')->on('san_pham');
        });

        Schema::create('don_hang', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->timestamps();
            $table->string('ma', ConstantSystem::DEFAULT_MAX_LENGTH)->unique();
            $table->timestamp('ngay_huy_don')->nullable();
            $table->timestamp('ngay_giao_hang')->nullable();
            $table->timestamp('ngay_hoan_thanh')->nullable();
            $table->enum('trang_thai', OrderStatus::toArray())->default(OrderStatus::CHO_XAC_NHAN);
            $table->string('ho_va_ten', ConstantSystem::FULL_NAME_MAX_LENGTH)->nullable();
            $table->string('email', ConstantSystem::EMAIL_MAX_LENGTH)->nullable();
            $table->string('dia_chi', ConstantSystem::ADDRESS_MAX_LENGTH)->nullable();
            $table->string('so_dien_thoai', ConstantSystem::PHONE_NUMBER_MAX_LENGTH)->nullable();
            $table->decimal('tien_ship', 15, 2)->default(0);
            $table->decimal('tong_tien_hang', 15, 2)->default(0);
            $table->foreignUuid('id_tai_khoan')->nullable()->references('id')->on('tai_khoan');
        });

        Schema::create('don_hang_chi_tiet', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->timestamps();
            $table->string('ten_kich_co', ConstantSystem::DEFAULT_MAX_LENGTH)->nullable();
            $table->decimal('don_gia', 15, 2)->default(0);
            $table->integer('so_luong')->default(0);
            $table->foreignUuid('id_don_hang')->references('id')->on('don_hang');
            $table->foreignUuid('id_san_pham')->references('id')->on('san_pham');
        });

        Schema::create('hinh_anh', function (Blueprint $table) {
            $table->timestamps();
            $table->uuid('id')->primary();
            $table->longText('duong_dan_url')->nullable();
            $table->foreignUuid('id_san_pham')->references('id')->on('san_pham');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('thuong_hieu');
        Schema::dropIfExists('kich_co');
        Schema::dropIfExists('mau_sac');
        Schema::dropIfExists('don_hang');
        Schema::dropIfExists('don_hang_chi_tiet');
        Schema::dropIfExists('tai_khoan');
        Schema::dropIfExists('gio_hang');
        Schema::dropIfExists('gio_hang_chi_tiet');
        Schema::dropIfExists('san_pham');
        Schema::dropIfExists('hinh_anh');
    }
};
