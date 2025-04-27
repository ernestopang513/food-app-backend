import { Module } from '@nestjs/common';
import { FoodStandsService } from './food-stands.service';
import { FoodStandsController } from './food-stands.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FoodStand } from './entities/food-stand.entity';
import { FoodStandDish } from 'src/food-stand-dish/entities/food-stand-dish.entity';

@Module({
  controllers: [FoodStandsController],
  providers: [FoodStandsService],
  imports: [
    TypeOrmModule.forFeature([
      FoodStand,
      FoodStandDish,
    ])
  ],
  exports: [
    FoodStandsService,
    TypeOrmModule
  ]
})
export class FoodStandsModule {}
