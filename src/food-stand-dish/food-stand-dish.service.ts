import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFoodStandDishDto } from './dto/create-food-stand-dish.dto';
import { UpdateFoodStandDishDto } from './dto/update-food-stand-dish.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FoodStandDish } from './entities/food-stand-dish.entity';
import { Repository } from 'typeorm';
import { FoodStand } from 'src/food-stands/entities/food-stand.entity';

@Injectable()
export class FoodStandDishService {

  constructor (
    @InjectRepository(FoodStandDish)
    private readonly foodStandDishRepository: Repository<FoodStandDish>,

    @InjectRepository(FoodStand)
    private readonly foodStandRepository: Repository<FoodStand>

  ) {}



  async create( foodStandId: string ,createFoodStandDishDto: CreateFoodStandDishDto) {

    const foodStand = await this.foodStandRepository.findOne({
      where: {id: foodStandId},
    });

    if (!foodStand)
      throw new NotFoundException(`Food Stand with id ${foodStandId} not found.`);

    const foodStandDish = this.foodStandDishRepository.create({
      ...createFoodStandDishDto,
      foodStand,
    })



    return this.foodStandDishRepository.save(foodStandDish);
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
