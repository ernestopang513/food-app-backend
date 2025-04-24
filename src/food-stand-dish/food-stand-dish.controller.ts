import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FoodStandDishService } from './food-stand-dish.service';
import { CreateFoodStandDishDto } from './dto/create-food-stand-dish.dto';
import { UpdateFoodStandDishDto } from './dto/update-food-stand-dish.dto';

@Controller('food-stand-dish')
export class FoodStandDishController {
  constructor(private readonly foodStandDishService: FoodStandDishService) {}

  @Post(':foodStandId')
  create(
  
    @Param('foodStandId') foodStandId: string,
    @Body() createFoodStandDishDto: CreateFoodStandDishDto
  
  ) {
    return this.foodStandDishService.create(foodStandId, createFoodStandDishDto);
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
  update(@Param('id') id: string, @Body() updateFoodStandDishDto: UpdateFoodStandDishDto) {
    return this.foodStandDishService.update(id, updateFoodStandDishDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.foodStandDishService.remove(id);
  }
}
