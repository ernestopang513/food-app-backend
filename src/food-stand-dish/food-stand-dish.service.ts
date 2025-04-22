import { Injectable } from '@nestjs/common';
import { CreateFoodStandDishDto } from './dto/create-food-stand-dish.dto';
import { UpdateFoodStandDishDto } from './dto/update-food-stand-dish.dto';

@Injectable()
export class FoodStandDishService {
  create(createFoodStandDishDto: CreateFoodStandDishDto) {
    return 'This action adds a new foodStandDish';
  }

  findAll() {
    return `This action returns all foodStandDish`;
  }

  findOne(id: number) {
    return `This action returns a #${id} foodStandDish`;
  }

  update(id: number, updateFoodStandDishDto: UpdateFoodStandDishDto) {
    return `This action updates a #${id} foodStandDish`;
  }

  remove(id: number) {
    return `This action removes a #${id} foodStandDish`;
  }
}
