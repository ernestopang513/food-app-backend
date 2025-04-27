import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateFoodStandDishDto } from './dto/create-food-stand-dish.dto';
import { UpdateFoodStandDishDto } from './dto/update-food-stand-dish.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FoodStandDish } from './entities/food-stand-dish.entity';
import { Repository } from 'typeorm';
import { FoodStand } from 'src/food-stands/entities/food-stand.entity';
import { Dish } from 'src/dish/entities/dish.entity';

@Injectable()
export class FoodStandDishService {

  private readonly logger = new Logger('FoodStandsService')

  constructor (
    @InjectRepository(FoodStandDish)
    private readonly foodStandDishRepository: Repository<FoodStandDish>,

    @InjectRepository(FoodStand)
    private readonly foodStandRepository: Repository<FoodStand>,

    @InjectRepository(Dish)
    private readonly dishRepository: Repository<Dish>

  ) {}



  async create( foodStandId: string, dishId: string ,createFoodStandDishDto: CreateFoodStandDishDto) {

    const foodStand = await this.foodStandRepository.findOne({
      where: {id: foodStandId},
    });

    if (!foodStand)
      throw new NotFoundException(`Food Stand with id ${foodStandId} not found.`);

    const dish = await this.dishRepository.findOne({
      where: {id: dishId},
    });

    if (!dish)
      throw new NotFoundException(`Dish with id ${dishId} not found.`);

    const foodStandDish = this.foodStandDishRepository.create({
      ...createFoodStandDishDto,
      foodStand,
      dish
    })



    return this.foodStandDishRepository.save(foodStandDish);
  }

  findAll() {
    return `This action returns all foodStandDish`;
  }

  async findOne(id: string) {

    try {
      const foodStandDish = await this.foodStandDishRepository.findOneBy({id});
      if (!foodStandDish)
        throw new NotFoundException(`Food Stand Dish with id ${id} not found`)
      return foodStandDish;
    } catch (error) {
      this.handleDBExceptions(error)
    }
    

    
  }

  async update(id: string, updateFoodStandDishDto: UpdateFoodStandDishDto) {

    const foodStandDish = await this.foodStandDishRepository.preload({
      id:id,
      ...updateFoodStandDishDto,
    })

    if ( !foodStandDish ) throw new NotFoundException(`Food stand dish with id: ${id} not found`);

    try {
      await this.foodStandDishRepository.save(foodStandDish);
      return foodStandDish;
    } catch (error) {
      this.logger.error(`Error updating food stand dish with id ${id}`, error.stack);
      this.handleDBExceptions(error);
    }
  }

  async remove(id: string) {
    const foodStandDish = await this.findOne(id)
    await this.foodStandDishRepository.remove(foodStandDish)
    return `This action removes a #${id} foodStandDish`;
  }

  async deleteAllFoodStandDish () {
    const query = this.foodStandDishRepository.createQueryBuilder('foodStand');

    try {
      return await query
        .delete()
        .where({})
        .execute();
    } catch (error) {
      this.handleDBExceptions(error)
    }
  }


  private handleDBExceptions(error: any): never {
      if (error.code === '23505')
        throw new BadRequestException(error.detail);
      this.logger.error(error);
      throw new InternalServerErrorException('Unexpected error, check server logs');
  
    }
}
