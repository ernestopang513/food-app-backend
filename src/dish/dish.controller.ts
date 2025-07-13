import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DishService } from './dish.service';
import { CreateDishDto } from './dto/create-dish.dto';
import { UpdateDishDto } from './dto/update-dish.dto';
import { Auth } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces/valid-roles';
import { ApiResponse } from '@nestjs/swagger';
import { ApiResponses } from 'src/common/swagger/api-responses';
import { Dish } from './entities/dish.entity';

@Controller('dish')
export class DishController {
  constructor(private readonly dishService: DishService) {}

  @Post()
  @Auth(ValidRoles.ADMIN)
  @ApiResponse({status: 201, description: 'Food stand creado', type: Dish})
  @ApiResponse(ApiResponses.BadRequest)
  @ApiResponse(ApiResponses.Unauthorized)
  @ApiResponse(ApiResponses.ServerError)
  create(@Body() createDishDto: CreateDishDto) {
    return this.dishService.create(createDishDto);
  }

  @Get()
  @ApiResponse({status: 200, description: 'Listado de puestos de platillos', type: [Dish]})
  @ApiResponse(ApiResponses.ServerError)
  @ApiResponse(ApiResponses.BadRequest)
  @ApiResponse(ApiResponses.NotFound)
  @ApiResponse(ApiResponses.Unauthorized)
  findAll() {
    return this.dishService.findAll();
  }

  @Get(':id')
  @ApiResponse({status: 200, description: 'Platillo de comida especifico', type: Dish})
  @ApiResponse(ApiResponses.ServerError)
  @ApiResponse(ApiResponses.BadRequest)
  @ApiResponse(ApiResponses.NotFound)
  @ApiResponse(ApiResponses.Unauthorized)
  findOne(@Param('id') id: string) {
    return this.dishService.findOne(id);
  }

  @Patch(':id')
  @Auth(ValidRoles.ADMIN)
  @ApiResponse({status: 200, description: 'Actualizado correctamente'})
  @ApiResponse(ApiResponses.BadRequest)
  @ApiResponse(ApiResponses.Unauthorized)
  @ApiResponse(ApiResponses.NotFound)
  @ApiResponse(ApiResponses.ServerError)
  update(@Param('id') id: string, @Body() updateDishDto: UpdateDishDto) {
    return this.dishService.update(id, updateDishDto);
  }

  @Delete(':id')
  @Auth(ValidRoles.ADMIN)
  @ApiResponse({status: 200, description: 'Eliminado exitosamente'})
  @ApiResponse(ApiResponses.BadRequest)
  @ApiResponse(ApiResponses.ServerError)
  @ApiResponse(ApiResponses.Unauthorized)
  @ApiResponse(ApiResponses.Forbidden)
  remove(@Param('id') id: string) {
    return this.dishService.remove(id);
  }
}
