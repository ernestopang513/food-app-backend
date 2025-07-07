import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FoodStandsModule } from './food-stands/food-stands.module';
import { FoodStandDishModule } from './food-stand-dish/food-stand-dish.module';
import { DishModule } from './dish/dish.module';
import { DeliveryPointModule } from './delivery-point/delivery-point.module';
import { SeedModule } from './seed/seed.module';
import { AuthModule } from './auth/auth.module';
import { OrderModule } from './order/order.module';
import { OrdersSocketModule } from './ordersSocket/ordersSocket.module';
import { DishImageModule } from './dish-image/dish-image.module';


@Module({
  imports: [
    ConfigModule.forRoot(),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: + (process.env.DB_PORT || 5432),
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true, //Carga automaticamente las entidades
      synchronize: true, // Este en produccon no se suele usar mejor hacer migraciones


    }),

    FoodStandsModule,

    FoodStandDishModule,

    DishModule,

    DeliveryPointModule,

    SeedModule,

    AuthModule,

    OrderModule,

    OrdersSocketModule,

    DishImageModule
  ],
})
export class AppModule {}
