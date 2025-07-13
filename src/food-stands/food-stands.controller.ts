import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { FoodStandsService } from './food-stands.service';
import { CreateFoodStandDto } from './dto/create-food-stand.dto';
import { UpdateFoodStandDto } from './dto/update-food-stand.dto';
import { Auth } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';
import { ApiResponse } from '@nestjs/swagger';
import { FoodStand } from './entities/food-stand.entity';
import { ApiResponses } from 'src/common/swagger/api-responses';

@Controller('food-stands')
// @Auth()
export class FoodStandsController {
  constructor(private readonly foodStandsService: FoodStandsService) {}

  @Post()

  @Auth(ValidRoles.ADMIN)
  @ApiResponse({status: 201, description: 'Food stand creado', type: FoodStand})
  @ApiResponse({status: 400, description: 'Bad request'})
  @ApiResponse({status: 401, description: 'Unauthorized'})
  @ApiResponse(ApiResponses.ServerError)
  create(@Body() createFoodStandDto: CreateFoodStandDto) {
    return this.foodStandsService.create(createFoodStandDto);
  }

  @Get()
  @ApiResponse({status: 200, description: 'Listado de puestos de comida', type: [FoodStand]})
  @ApiResponse(ApiResponses.ServerError)
  @ApiResponse(ApiResponses.BadRequest)
  @ApiResponse(ApiResponses.NotFound)
  @ApiResponse(ApiResponses.Unauthorized)
  findAll() {
    return this.foodStandsService.findAll();
  }

  @Get(':id')
  @ApiResponse({status: 200, description: 'Puesto de comida especifico', type: FoodStand})
  @ApiResponse(ApiResponses.ServerError)
  @ApiResponse(ApiResponses.BadRequest)
  @ApiResponse(ApiResponses.NotFound)
  @ApiResponse(ApiResponses.Unauthorized)
  findOne(@Param('id') id: string) {
    return this.foodStandsService.findOne(id);
  }

  @Patch(':id')
  @Auth(ValidRoles.ADMIN)
  @ApiResponse({status: 200, description: 'Actualizado correctamente'})
  @ApiResponse(ApiResponses.BadRequest)
  @ApiResponse(ApiResponses.Unauthorized)
  @ApiResponse(ApiResponses.NotFound)
  @ApiResponse(ApiResponses.ServerError)
  update(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() updateFoodStandDto: UpdateFoodStandDto
  ) {
    return this.foodStandsService.update(id, updateFoodStandDto);
  }

  @Delete(':id')
  @Auth(ValidRoles.ADMIN)
  @ApiResponse({status: 200, description: 'Eliminado exitosamente'})
  @ApiResponse(ApiResponses.BadRequest)
  @ApiResponse(ApiResponses.ServerError)
  @ApiResponse(ApiResponses.Unauthorized)
  @ApiResponse(ApiResponses.Forbidden)
  remove(@Param('id') id: string) {
    return this.foodStandsService.remove(id);
  }
}
