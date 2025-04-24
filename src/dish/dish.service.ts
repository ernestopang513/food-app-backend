import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateDishDto } from './dto/create-dish.dto';
import { UpdateDishDto } from './dto/update-dish.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Dish } from './entities/dish.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DishService {

  private readonly logger = new Logger('DishService')
  constructor(
    
    @InjectRepository(Dish)
    private readonly dishRepository: Repository<Dish>

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
    return `This action returns all dish`;
  }

  findOne(id: number) {
    return `This action returns a #${id} dish`;
  }

  update(id: number, updateDishDto: UpdateDishDto) {
    return `This action updates a #${id} dish`;
  }

  remove(id: number) {
    return `This action removes a #${id} dish`;
  }

  private handleDBExceptions(error: any): never {
      if (error.code === '23505')
        throw new BadRequestException(error.detail);
      this.logger.error(error);
      throw new InternalServerErrorException('Unexpected error, check server logs');
  
    }
}
