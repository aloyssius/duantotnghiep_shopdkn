<?php

namespace Database\Seeders;

use App\Constants\Role;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;

class RoleTableSeeder extends Seeder
{
    public function run()
    {
        $faker = Faker::create();

        DB::table('vai_tro')->insert([
            ['id' => $faker->uuid, 'ma' => Role::ADMIN, 'ten' => Role::ADMIN_VI],
            ['id' => $faker->uuid, 'ma' => Role::EMPLOYEE, 'ten' => Role::EMPLOYEE_VI],
            ['id' => $faker->uuid, 'ma' => Role::CUSTOMER, 'ten' => Role::CUSTOMER_VI],
        ]);
    }
}
