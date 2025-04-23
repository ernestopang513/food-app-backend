import { Module } from '@nestjs/common';
import { FoodStandDishService } from './food-stand-dish.service';
import { FoodStandDishController } from './food-stand-dish.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FoodStandDish } from './entities/food-stand-dish.entity';
import { FoodStand } from 'src/food-stands/entities/food-stand.entity';

@Module({
  controllers: [FoodStandDishController],
  providers: [FoodStandDishService],
  imports: [
    TypeOrmModule.forFeature([
      FoodStandDish,
      FoodStand
    ])
  ]
})
export class FoodStandDishModule {}
