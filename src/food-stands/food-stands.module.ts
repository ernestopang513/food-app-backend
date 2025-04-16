import { Module } from '@nestjs/common';
import { FoodStandsService } from './food-stands.service';
import { FoodStandsController } from './food-stands.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FoodStand } from './entities/food-stand.entity';

@Module({
  controllers: [FoodStandsController],
  providers: [FoodStandsService],
  imports: [
    TypeOrmModule.forFeature([FoodStand])
  ]
})
export class FoodStandsModule {}
