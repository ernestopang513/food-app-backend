import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateDishDto } from './dto/create-dish.dto';
import { UpdateDishDto } from './dto/update-dish.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Dish } from './entities/dish.entity';
import { Repository } from 'typeorm';
import { FoodStandDish } from 'src/food-stand-dish/entities/food-stand-dish.entity';

@Injectable()
export class DishService {

  private readonly logger = new Logger('DishService')
  constructor(
    
    @InjectRepository(Dish)
    private readonly dishRepository: Repository<Dish>,

    // @InjectRepository(FoodStandDish)
    // private readonly foodStandDishRepository: Repository<FoodStandDish>

  ){}


  async create(createDishDto: CreateDishDto) {
    try {
      const dish = this.dishRepository.create(createDishDto);
      await this.dishRepository.save(dish)
      return dish;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  findAll() {
    return this.dishRepository.find({})
  }

  async findOne(id: string) {

    try {

      const dish = await this.dishRepository.findOneBy({id});
      if(!dish) throw new NotFoundException(`Dish with id ${id} not found`);

      return dish;
      
    } catch (error) {
      this.handleDBExceptions(error);
    }

  }

  async update(id: string, updateDishDto: UpdateDishDto) {

    const dish = await this.dishRepository.preload({
      id: id,
      ...updateDishDto
    })

    if (!dish) throw new NotFoundException(`Dish with id: ${id} not found`);

    try {
      await this.dishRepository.save(dish);
      return dish
    } catch (error) {
      this.logger.error(`Error updating food stand dish with id: ${id}`, error.stack);
      this.handleDBExceptions(error);
    }

  }

  async remove(id: string) {

    const dish = await this.findOne(id)
    await this.dishRepository.remove(dish)

  }

  private handleDBExceptions(error: any): never {
      if (error.code === '23505')
        throw new BadRequestException(error.detail);
      this.logger.error(error);
      throw new InternalServerErrorException('Unexpected error, check server logs');
  
    }
}
