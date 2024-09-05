<?php

namespace Database\Seeders;

use App\Constants\CommonStatus;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;

class AttributeTableSeeder extends Seeder
{
    public function run()
    {
        $faker = Faker::create();
        $created_at1 = Carbon::now();
        $created_at2 = Carbon::parse($created_at1)->addMinutes(1);
        $created_at3 = Carbon::parse($created_at2)->addMinutes(1);
        $created_at4 = Carbon::parse($created_at3)->addMinutes(1);
        $created_at5 = Carbon::parse($created_at4)->addMinutes(1);
        $created_at6 = Carbon::parse($created_at5)->addMinutes(1);
        $created_at7 = Carbon::parse($created_at6)->addMinutes(1);
        $created_at8 = Carbon::parse($created_at7)->addMinutes(1);
        $created_at9 = Carbon::parse($created_at8)->addMinutes(1);
        $created_at10 = Carbon::parse($created_at9)->addMinutes(1);
        $created_at11 = Carbon::parse($created_at10)->addMinutes(1);
        $created_at12 = Carbon::parse($created_at11)->addMinutes(1);

        DB::table('danh_muc')->insert([
            'id' => $faker->uuid,
            'ma' => "DM0001",
            'ten' => "Nam",
            'trang_thai' => CommonStatus::IS_ACTIVE,
            'created_at' => $created_at1,
        ]);
        DB::table('danh_muc')->insert([
            'id' => $faker->uuid,
            'ma' => "DM0002",
            'ten' => "Nữ",
            'trang_thai' => CommonStatus::IS_ACTIVE,
            'created_at' => $created_at2,
        ]);
        DB::table('danh_muc')->insert([
            'id' => $faker->uuid,
            'ma' => "DM0003",
            'ten' => "Unisex",
            'trang_thai' => CommonStatus::IS_ACTIVE,
            'created_at' => $created_at3,
        ]);
        DB::table('thuong_hieu')->insert([
            'id' => $faker->uuid,
            'ma' => "TH0001",
            'ten' => "Nike",
            'trang_thai' => CommonStatus::IS_ACTIVE,
            'created_at' => $created_at1,
        ]);
        DB::table('thuong_hieu')->insert([
            'id' => $faker->uuid,
            'ma' => "TH0002",
            'ten' => "Adidas",
            'trang_thai' => CommonStatus::IS_ACTIVE,
            'created_at' => $created_at2,
        ]);
        DB::table('thuong_hieu')->insert([
            'id' => $faker->uuid,
            'ma' => "TH0003",
            'ten' => "Converse",
            'trang_thai' => CommonStatus::IS_ACTIVE,
            'created_at' => $created_at3,
        ]);
        DB::table('thuong_hieu')->insert([
            'id' => $faker->uuid,
            'ma' => "TH0004",
            'ten' => "Vans",
            'trang_thai' => CommonStatus::IS_ACTIVE,
            'created_at' => $created_at4,
        ]);
        DB::table('thuong_hieu')->insert([
            'id' => $faker->uuid,
            'ma' => "TH0005",
            'ten' => "New Balance",
            'trang_thai' => CommonStatus::IS_ACTIVE,
            'created_at' => $created_at5,
        ]);
        DB::table('thuong_hieu')->insert([
            'id' => $faker->uuid,
            'ma' => "TH0006",
            'ten' => "Puma",
            'trang_thai' => CommonStatus::IS_ACTIVE,
            'created_at' => $created_at6,
        ]);

        DB::table('mau_sac')->insert([
            'id' => $faker->uuid,
            'ma' => "#C10013",
            'ten' => "Red",
            'trang_thai' => CommonStatus::IS_ACTIVE,
            'created_at' => $created_at1,
        ]);
        DB::table('mau_sac')->insert([
            'id' => $faker->uuid,
            'ma' => "#464646",
            'ten' => "Black",
            'trang_thai' => CommonStatus::IS_ACTIVE,
            'created_at' => $created_at2,
        ]);
        DB::table('mau_sac')->insert([
            'id' => $faker->uuid,
            'ma' => "#E9662C",
            'ten' => "Orange",
            'trang_thai' => CommonStatus::IS_ACTIVE,
            'created_at' => $created_at3,
        ]);
        DB::table('mau_sac')->insert([
            'id' => $faker->uuid,
            'ma' => "#F5D255",
            'ten' => "Yellow",
            'trang_thai' => CommonStatus::IS_ACTIVE,
            'created_at' => $created_at4,
        ]);
        DB::table('mau_sac')->insert([
            'id' => $faker->uuid,
            'ma' => "#F1778A",
            'ten' => "Pink",
            'trang_thai' => CommonStatus::IS_ACTIVE,
            'created_at' => $created_at5,
        ]);
        DB::table('mau_sac')->insert([
            'id' => $faker->uuid,
            'ma' => "#8A5CA0",
            'ten' => "Violet",
            'trang_thai' => CommonStatus::IS_ACTIVE,
            'created_at' => $created_at6,
        ]);
        DB::table('mau_sac')->insert([
            'id' => $faker->uuid,
            'ma' => "#6D9951",
            'ten' => "Green",
            'trang_thai' => CommonStatus::IS_ACTIVE,
            'created_at' => $created_at7,
        ]);
        DB::table('mau_sac')->insert([
            'id' => $faker->uuid,
            'ma' => "#FFFFFF",
            'ten' => "White",
            'trang_thai' => CommonStatus::IS_ACTIVE,
            'created_at' => $created_at8,
        ]);
        DB::table('mau_sac')->insert([
            'id' => $faker->uuid,
            'ma' => "#865439",
            'ten' => "Brown",
            'trang_thai' => CommonStatus::IS_ACTIVE,
            'created_at' => $created_at9,
        ]);
        DB::table('mau_sac')->insert([
            'id' => $faker->uuid,
            'ma' => "#C3C3C3",
            'ten' => "Grey",
            'trang_thai' => CommonStatus::IS_ACTIVE,
            'created_at' => $created_at10,
        ]);
        DB::table('mau_sac')->insert([
            'id' => $faker->uuid,
            'ma' => "#003171",
            'ten' => "Blue",
            'trang_thai' => CommonStatus::IS_ACTIVE,
            'created_at' => $created_at11,
        ]);
    }
}
