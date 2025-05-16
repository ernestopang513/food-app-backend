import { Module } from '@nestjs/common';
import { DishService } from './dish.service';
import { DishController } from './dish.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dish } from './entities/dish.entity';
import { FoodStandDish } from 'src/food-stand-dish/entities/food-stand-dish.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [DishController],
  providers: [DishService],
  imports: [
    TypeOrmModule.forFeature([
      Dish
    ]),
    AuthModule
  ],
  exports: [
    DishService,
  ]
})
export class DishModule {}
