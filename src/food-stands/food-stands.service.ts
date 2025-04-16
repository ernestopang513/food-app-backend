import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateFoodStandDto } from './dto/create-food-stand.dto';
import { UpdateFoodStandDto } from './dto/update-food-stand.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FoodStand } from './entities/food-stand.entity';

@Injectable()
export class FoodStandsService {

  constructor (

    @InjectRepository(FoodStand)
    private readonly foodStandRepository: Repository<FoodStand>


  ) {}
  
  async create(createFoodStandDto: CreateFoodStandDto) {

    try {
      const foodStand = this.foodStandRepository.create(createFoodStandDto);
      await this.foodStandRepository.save(foodStand);

      return foodStand

    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException('Ayuda');
    }


  }

  findAll() {
    return `This action returns all foodStands`;
  }

  findOne(id: number) {
    return `This action returns a #${id} foodStand`;
  }

  update(id: number, updateFoodStandDto: UpdateFoodStandDto) {
    return `This action updates a #${id} foodStand`;
  }

  remove(id: number) {
    return `This action removes a #${id} foodStand`;
  }
}
