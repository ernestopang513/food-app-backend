import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Auth } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';
import { ApiResponse } from '@nestjs/swagger';
import { ApiResponses } from 'src/common/swagger/api-responses';
import { Order } from './entities/order.entity';
import { FilterOrderDto } from './dto/filter-orders.dto';
import { AssignDeliveryDto } from './dto/assingn-delivery-status.dto';

@Controller('order')
@Auth()
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @ApiResponse({status: 201, description: 'Orden creada', type: Order})
  @ApiResponse(ApiResponses.BadRequest)
  @ApiResponse(ApiResponses.Unauthorized)
  @ApiResponse(ApiResponses.ServerError)
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.create(createOrderDto);
  }

  @Get()
  @ApiResponse({status: 200, description: 'Listado de ordenes', type: [Order]})
  @ApiResponse(ApiResponses.ServerError)
  @ApiResponse(ApiResponses.BadRequest)
  @ApiResponse(ApiResponses.NotFound)
  @ApiResponse(ApiResponses.Unauthorized)
  findAll() {
    return this.orderService.findAll();
  }
  
  @Get('waiting')
  @ApiResponse({status: 200, description: 'Listado de todas las ordenes pendientes', type: [Order]})
  @ApiResponse(ApiResponses.ServerError)
  @ApiResponse(ApiResponses.BadRequest)
  @ApiResponse(ApiResponses.NotFound)
  @ApiResponse(ApiResponses.Unauthorized)
  findAllWaitingOrders(
    @Query() filterDto: FilterOrderDto
  ) {
    return this.orderService.findAllWaitingOrders(filterDto);
  }
  
  @Get('canceled')
  @ApiResponse({status: 200, description: 'Listado de todas las ordenes canceladas', type: [Order]})
  @ApiResponse(ApiResponses.ServerError)
  @ApiResponse(ApiResponses.BadRequest)
  @ApiResponse(ApiResponses.NotFound)
  @ApiResponse(ApiResponses.Unauthorized)
  findAllCanceledOrders() {
    return this.orderService.findAllCanceledOrders();
  }

  @Get('deliveryUserOrders/:deliveryUserId')
  @ApiResponse({status: 200, description: 'Listado de todas las ordenes del repartidor que las pide', type: [Order]})
  @ApiResponse(ApiResponses.ServerError)
  @ApiResponse(ApiResponses.BadRequest)
  @ApiResponse(ApiResponses.NotFound)
  @ApiResponse(ApiResponses.Unauthorized)
  deliveryUserOrders(
    @Param('deliveryUserId') deliveryUserId: string,
    // @Body() updateOrderDto: UpdateOrderDto 
    @Query() filterDto: FilterOrderDto
  ) {
    return this.orderService.deliveryUserOrders(deliveryUserId, filterDto);
  }
  
  @Get('userOrders/:userId')
  @ApiResponse({status: 200, description: 'Listado de todas las ordenes de un usuario', type: [Order]})
  @ApiResponse(ApiResponses.ServerError)
  @ApiResponse(ApiResponses.BadRequest)
  @ApiResponse(ApiResponses.NotFound)
  @ApiResponse(ApiResponses.Unauthorized)
  userOrders(
    @Param('userId') userId: string,
  ) {
    return this.orderService.userOrders(userId);
  }

  @Get(':id')
  @ApiResponse({status: 200, description: 'Orden especifica', type: Order})
  @ApiResponse(ApiResponses.ServerError)
  @ApiResponse(ApiResponses.BadRequest)
  @ApiResponse(ApiResponses.NotFound)
  @ApiResponse(ApiResponses.Unauthorized)
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(id);
  }

  @Patch(':id/assign-delivery')
  @Auth(ValidRoles.EMPLOYEE, ValidRoles.ADMIN)
  @ApiResponse({status: 200, description: 'Actualizado correctamente'})
  @ApiResponse(ApiResponses.BadRequest)
  @ApiResponse(ApiResponses.Unauthorized)
  @ApiResponse(ApiResponses.NotFound)
  @ApiResponse(ApiResponses.ServerError)
  async assingDeliveryUser(
    @Param('id') id: string, 
    @Body() assingDeliveryDto: AssignDeliveryDto) {

    return this.orderService.assignDeliveryUser(id, assingDeliveryDto);
    
  }
 
  @Patch(':id/cancel')
  @ApiResponse({status: 200, description: 'Cancela correctamente la'})
  @ApiResponse(ApiResponses.BadRequest)
  @ApiResponse(ApiResponses.Unauthorized)
  @ApiResponse(ApiResponses.NotFound)
  @ApiResponse(ApiResponses.ServerError)
  cancelOrder(

    @Param('id') id: string, 

    @Body() updateOrderDto: UpdateOrderDto

  ) {
    
    return this.orderService.cancelOrder(id, updateOrderDto);
    
  }
  
  // @Patch(':id')
  // update(@Param('id') id: string, @Body() createOrderDto: CreateOrderDto) {
  //   return this.orderService.update(id, createOrderDto);
  // }

  @Delete(':id')
  @Auth(ValidRoles.ADMIN, ValidRoles.EMPLOYEE)
  @ApiResponse({status: 200, description: 'Eliminado exitosamente'})
  @ApiResponse(ApiResponses.BadRequest)
  @ApiResponse(ApiResponses.ServerError)
  @ApiResponse(ApiResponses.Unauthorized)
  @ApiResponse(ApiResponses.Forbidden)
  remove(@Param('id') id: string) {
    return this.orderService.remove(id);
  }
  
  // @Delete(':id')
  // remove2(@Param('id') id: string) {
  //   return this.orderService.remove(id);
  // }
  
}
