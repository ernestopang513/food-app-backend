import { Module } from '@nestjs/common';
import { DishImageService } from './dish-image.service';
import { DishImageController } from './dish-image.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dish } from 'src/dish/entities/dish.entity';
import { AuthModule } from 'src/auth/auth.module';
import { DishImage } from './entities/dish-image.entity';

@Module({
  controllers: [DishImageController],
  providers: [DishImageService],
  imports: [
    TypeOrmModule.forFeature([
      DishImage,
      Dish
    ]),
    AuthModule
  ]
})
export class DishImageModule {}
