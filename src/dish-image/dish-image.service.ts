import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateDishImageDto } from './dto/create-dish-image.dto';
import { UpdateDishImageDto } from './dto/update-dish-image.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Dish } from 'src/dish/entities/dish.entity';
import { Repository } from 'typeorm';
import { DishImage } from './entities/dish-image.entity';

@Injectable()
export class DishImageService {


  private readonly logger = new Logger('DishImageService');

  constructor(

    @InjectRepository(DishImage)
    private readonly dishImageRepository: Repository<DishImage>,

    @InjectRepository(Dish)
    private readonly dishRepository: Repository<Dish>
  ){}



  async create( dishId: string, createDishImageDto: CreateDishImageDto) {

    try {
      const dish = await this.dishRepository.findOne({
        where: {id: dishId}
      })
  
      if(!dish)
        throw new NotFoundException(`Dish not found`);
  
      const dishImage = this.dishImageRepository.create({
        ...createDishImageDto,
        dish
      });
  
      return this.dishImageRepository.save(dishImage);
      
    } catch (error) {
      // this.logger.error('Error relacion imagen platillo', error.stack)
      this.handleDBExceptions(error);
    }


  }

  // findAll() {
  //   return `This action returns all dishImage`;
  // }

  private async findOne(id: string) {

    try {
      const dishImage = await this.dishImageRepository.findOne({
        where: {id}
      }) 
      if(!dishImage)
        throw new NotFoundException('Image no encontrantrada')
      return dishImage;
    } catch (error) {
      this.handleDBExceptions(error)
    }

  }

  // update(id: number, updateDishImageDto: UpdateDishImageDto) {
  //   return `This action updates a #${id} dishImage`;
  // }

  async remove(id: string) {
    const dishImage = await this.findOne(id);
    await this.dishImageRepository.remove(dishImage)
    return `This action removes a #${id} dishImage`;
  }

  private handleDBExceptions(error: any): never {
        if (error.code === '23505')
          throw new BadRequestException(error.detail);
        this.logger.error(error);
        throw new InternalServerErrorException('Unexpected error, check server logs');
      }
}
