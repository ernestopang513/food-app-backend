import { Module } from '@nestjs/common';
import { DishService } from './dish.service';
import { DishController } from './dish.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dish } from './entities/dish.entity';

@Module({
  controllers: [DishController],
  providers: [DishService],
  imports: [
    TypeOrmModule.forFeature([
      Dish,
    ])
  ]
})
export class DishModule {}
