import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { FoodStandDishModule } from 'src/food-stand-dish/food-stand-dish.module';
import { FoodStandsModule } from 'src/food-stands/food-stands.module';
import { DishModule } from 'src/dish/dish.module';
import { AuthModule } from 'src/auth/auth.module';
import { DeliveryPointModule } from 'src/delivery-point/delivery-point.module';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports: [
    FoodStandsModule,
    DishModule,
    FoodStandDishModule,
    DeliveryPointModule,
    // AuthService,
    AuthModule
  ]
})
export class SeedModule {}
