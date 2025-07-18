import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateFoodStandDto } from './dto/create-food-stand.dto';
import { UpdateFoodStandDto } from './dto/update-food-stand.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FoodStand } from './entities/food-stand.entity';

import {validate as isUUID} from 'uuid';
import { FoodStandDish } from 'src/food-stand-dish/entities/food-stand-dish.entity';

@Injectable()
export class FoodStandsService {

  private readonly logger = new Logger('FoodStandsService')

  constructor (

    @InjectRepository(FoodStand)
    private readonly foodStandRepository: Repository<FoodStand>,

    // @InjectRepository(FoodStandDish)
    // private readonly foodStandDishRepository: Repository<FoodStandDish>


  ) {}
  
  async create(createFoodStandDto: CreateFoodStandDto) {

    try {
      // const { foodStandDishes = [], ...foodStandDetails } = createFoodStandDto;

      // const foodStand = this.foodStandRepository.create({
      //   ...foodStandDetails,
      //   foodStandDishes: []
      // });
      const foodStand = this.foodStandRepository.create( createFoodStandDto );
      await this.foodStandRepository.save(foodStand);

      return foodStand

    } catch (error) {
      this.handleDBExceptions(error);
    }

  }

  // findAll() {
  //   return this.foodStandRepository.find({
  //     relations: ['foodStandDishes', 'foodStandDishes.dish'],
  //     order: {
  //       name: 'ASC'
  //     }
  //   })
  // }

  findAll() {
  return this.foodStandRepository
    .createQueryBuilder('foodStand')
    .leftJoinAndSelect('foodStand.foodStandDishes', 'foodStandDish')
    .leftJoinAndSelect('foodStandDish.dish', 'dish')
    .orderBy('foodStand.createdAt', 'ASC')         // ordena los food stands
    .addOrderBy('dish.name', 'ASC')           // ordena los dishes dentro de cada foodStandDish
    .getMany();
}

  async findOne(id: string) {
  

    try {
      const foodStand = await this.foodStandRepository.findOne({ 
        where: {id},
        relations: ['foodStandDishes', 'foodStandDishes.dish'],
        order: {
          foodStandDishes: {
            dish: {
              name: 'ASC'
            }
          }
        }
      }) ;
      if ( !foodStand )
        throw new NotFoundException(`Food Stand with id ${id} not found.`);
      
      return foodStand;
      
    } catch (error) {
      this.handleDBExceptions(error);
    }


  }

  async update(id: string, updateFoodStandDto: UpdateFoodStandDto) {

    const foodStand = await this.foodStandRepository.preload({
      id: id,
      ...updateFoodStandDto
    });

    if ( !foodStand ) throw new NotFoundException(`Food stand with id: ${id} not found`);

    try {

      await this.foodStandRepository.save(foodStand);
  
      return foodStand;
      
    } catch (error) {
      this.logger.error(error)
      this.handleDBExceptions(error)
    }

  }

  async remove(id: string) {

    const foodStand = await this.findOne( id );
    
    await this.foodStandRepository.remove( foodStand );


    
  }



  private handleDBExceptions(error: any): never {
    if (error.code === '23505')
      throw new BadRequestException(error.detail);
    this.logger.error(error);
    this.logger.log(error);
    throw new InternalServerErrorException('Unexpected error, check server logs');

  }

  async deleteAllFoodStands () {
    const query = this.foodStandRepository.createQueryBuilder('foodStand');

    try {
      return await query
        .delete()
        .where({})
        .execute();
    } catch (error) {
      this.handleDBExceptions(error)
    }
  }

}
