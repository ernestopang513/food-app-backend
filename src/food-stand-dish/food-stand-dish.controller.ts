import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FoodStandDishService } from './food-stand-dish.service';
import { CreateFoodStandDishDto } from './dto/create-food-stand-dish.dto';
import { UpdateFoodStandDishDto } from './dto/update-food-stand-dish.dto';
import { Auth } from '../auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';
import { ApiResponse } from '@nestjs/swagger';
import { ApiResponses } from 'src/common/swagger/api-responses';
import { FoodStandDish } from './entities/food-stand-dish.entity';
import { Dish } from 'src/dish/entities/dish.entity';

@Controller('food-stand-dish')
@Auth()
export class FoodStandDishController {
  constructor(private readonly foodStandDishService: FoodStandDishService) {}

  @Post(':foodStandId/:dishId')
  @Auth(ValidRoles.ADMIN)
  @ApiResponse({status: 201, description: 'Info de platillo de food stand creado', type: FoodStandDish})
  @ApiResponse(ApiResponses.BadRequest)
  @ApiResponse(ApiResponses.Unauthorized)
  @ApiResponse(ApiResponses.ServerError)
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
  @ApiResponse({status: 200, description: 'Info de platillo de comida en food stand especifico', type: Dish})
  @ApiResponse(ApiResponses.ServerError)
  @ApiResponse(ApiResponses.BadRequest)
  @ApiResponse(ApiResponses.NotFound)
  @ApiResponse(ApiResponses.Unauthorized)
  findOne(@Param('id') id: string) {
    return this.foodStandDishService.findOne(id);
  }

  @Patch(':id')
  @Auth(ValidRoles.ADMIN)
  @ApiResponse({status: 200, description: 'Actualizado correctamente'})
  @ApiResponse(ApiResponses.BadRequest)
  @ApiResponse(ApiResponses.Unauthorized)
  @ApiResponse(ApiResponses.NotFound)
  @ApiResponse(ApiResponses.ServerError)
  update(@Param('id') id: string, @Body() updateFoodStandDishDto: UpdateFoodStandDishDto) {
    return this.foodStandDishService.update(id, updateFoodStandDishDto);
  }

  @Delete(':id')
  @Auth(ValidRoles.ADMIN)
  @ApiResponse({status: 200, description: 'Eliminado exitosamente'})
  @ApiResponse(ApiResponses.BadRequest)
  @ApiResponse(ApiResponses.ServerError)
  @ApiResponse(ApiResponses.Unauthorized)
  @ApiResponse(ApiResponses.Forbidden)
  remove(@Param('id') id: string) {
    return this.foodStandDishService.remove(id);
  }
}
