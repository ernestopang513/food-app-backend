import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DeliveryPointService } from './delivery-point.service';
import { CreateDeliveryPointDto } from './dto/create-delivery-point.dto';
import { UpdateDeliveryPointDto } from './dto/update-delivery-point.dto';
import { Auth } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces/valid-roles';
import { ApiResponse } from '@nestjs/swagger';
import { DeliveryPoint } from './entities/delivery-point.entity';
import { ApiResponses } from 'src/common/swagger/api-responses';

@Controller('delivery-point')
// @Auth()
export class DeliveryPointController {
  constructor(private readonly deliveryPointService: DeliveryPointService) {}

  @Post()
  @Auth(ValidRoles.ADMIN)
  @ApiResponse({status: 201, description: 'Delivery point creado', type: DeliveryPoint})
  @ApiResponse(ApiResponses.BadRequest)
  @ApiResponse(ApiResponses.Unauthorized)
  @ApiResponse(ApiResponses.ServerError)
  create(@Body() createDeliveryPointDto: CreateDeliveryPointDto) {
    return this.deliveryPointService.create(createDeliveryPointDto);
  }

  @Get()
  @ApiResponse({status: 200, description: 'Listado de puntos de entrega', type: [DeliveryPoint]})
  @ApiResponse(ApiResponses.BadRequest)
  @ApiResponse(ApiResponses.ServerError)
  @ApiResponse(ApiResponses.Unauthorized)
  findAll() {
    return this.deliveryPointService.findAll();
  }

  @Get(':id')
  @ApiResponse({status: 200, description: 'Punto de entrega especifico', type: DeliveryPoint})
  @ApiResponse(ApiResponses.BadRequest)
  @ApiResponse(ApiResponses.ServerError)
  @ApiResponse(ApiResponses.Unauthorized)
  @ApiResponse(ApiResponses.NotFound)
  findOne(@Param('id') id: string) {
    return this.deliveryPointService.findOne(id);
  }

  @Patch(':id')
  @Auth(ValidRoles.ADMIN)
  @ApiResponse({status: 200, description: 'Actualizado correctamente'})
  @ApiResponse(ApiResponses.BadRequest)
  @ApiResponse(ApiResponses.ServerError)
  @ApiResponse(ApiResponses.Unauthorized)
  @ApiResponse(ApiResponses.NotFound)
  update(@Param('id') id: string, @Body() updateDeliveryPointDto: UpdateDeliveryPointDto) {
    return this.deliveryPointService.update(id, updateDeliveryPointDto);
  }

  @Delete(':id')
  @Auth(ValidRoles.ADMIN)
  @ApiResponse({status: 200, description: 'Eliminado exitosamente'})
  @ApiResponse(ApiResponses.BadRequest)
  @ApiResponse(ApiResponses.ServerError)
  @ApiResponse(ApiResponses.Unauthorized)
  @ApiResponse(ApiResponses.NotFound)
  remove(@Param('id') id: string) {
    return this.deliveryPointService.remove(id);
  }
}
