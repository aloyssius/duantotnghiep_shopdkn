<?php

namespace Database\Seeders;

use App\Constants\CommonStatus;
use App\Constants\Role as ConstantsRole;
use App\Models\Role;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;

class AccountTableSeeder extends Seeder
{
    public function run()
    {
        $faker = Faker::create();
        $created_at1 = Carbon::now();
        $created_at2 = Carbon::parse($created_at1)->addMinutes(1);
        $created_at3 = Carbon::parse($created_at2)->addMinutes(1);
        $created_at4 = Carbon::parse($created_at3)->addMinutes(1);

        DB::table('tai_khoan')->insert([
            'id' => $faker->uuid,
            'ma' => "AD0001",
            'ho_va_ten' => "Anh Ngọc",
            'mat_khau' => bcrypt("123456"),
            'email' => 'chuanhngoc2003@gmail.com',
            'vai_tro' => ConstantsRole::ADMIN,
            'created_at' => $created_at1,
        ]);

        DB::table('tai_khoan')->insert([
            'id' => $faker->uuid,
            'ma' => "NV0002",
            'ho_va_ten' => "Hồ Văn Thắng",
            'ngay_sinh' => now(),
            'mat_khau' => bcrypt("123456"),
            'so_dien_thoai' => '0978774485',
            'email' => 'hovanthang2003@gmail.com',
            'gioi_tinh' => 0,
            'vai_tro' => ConstantsRole::NHAN_VIEN,
            'created_at' => $created_at2,
        ]);

        DB::table('tai_khoan')->insert([
            'id' => $faker->uuid,
            'ma' => "AD0003",
            'ho_va_ten' => "Hồ Khánh Đăng",
            'mat_khau' => bcrypt("123456"),
            'email' => 'danghkph22590@fpt.edu.vn',
            'vai_tro' => ConstantsRole::ADMIN,
            'created_at' => $created_at3,
        ]);

        DB::table('tai_khoan')->insert([
            'id' => $faker->uuid,
            'ma' => "AD0004",
            'ho_va_ten' => "Đỗ Dương",
            'mat_khau' => bcrypt("123456"),
            'email' => 'doduong2003@gmail.com',
            'vai_tro' => ConstantsRole::ADMIN,
            'created_at' => $created_at4,
        ]);
    }
}
