import { Module } from '@nestjs/common';
import { FoodStandDishService } from './food-stand-dish.service';
import { FoodStandDishController } from './food-stand-dish.controller';

@Module({
  controllers: [FoodStandDishController],
  providers: [FoodStandDishService],
})
export class FoodStandDishModule {}
