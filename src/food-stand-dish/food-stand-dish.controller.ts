import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FoodStandDishService } from './food-stand-dish.service';
import { CreateFoodStandDishDto } from './dto/create-food-stand-dish.dto';
import { UpdateFoodStandDishDto } from './dto/update-food-stand-dish.dto';
import { Auth } from '../auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';

@Controller('food-stand-dish')
@Auth()
export class FoodStandDishController {
  constructor(private readonly foodStandDishService: FoodStandDishService) {}

  @Post(':foodStandId/:dishId')
  @Auth(ValidRoles.ADMIN)
  
  create(
  
    @Param('foodStandId') foodStandId: string,
    @Param('dishId') dishId: string,
    @Body() createFoodStandDishDto: CreateFoodStandDishDto
  
  ) {
    return this.foodStandDishService.create(foodStandId, dishId ,  createFoodStandDishDto);
  }

  // @Get()
  // findAll() {
  //   return this.foodStandDishService.findAll();
  // }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.foodStandDishService.findOne(id);
  }

  @Patch(':id')
  @Auth(ValidRoles.ADMIN)
  update(@Param('id') id: string, @Body() updateFoodStandDishDto: UpdateFoodStandDishDto) {
    return this.foodStandDishService.update(id, updateFoodStandDishDto);
  }

  @Delete(':id')
  @Auth(ValidRoles.ADMIN)
  remove(@Param('id') id: string) {
    return this.foodStandDishService.remove(id);
  }
}
