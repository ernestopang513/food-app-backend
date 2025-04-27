import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { FoodStandDishModule } from 'src/food-stand-dish/food-stand-dish.module';
import { FoodStandsModule } from 'src/food-stands/food-stands.module';
import { DishModule } from 'src/dish/dish.module';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports: [
    FoodStandsModule,
    DishModule,
    FoodStandDishModule
  ]
})
export class SeedModule {}
