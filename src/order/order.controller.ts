import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Auth } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';

@Controller('order')
@Auth()
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.create(createOrderDto);
  }

  @Get()
  findAll() {
    return this.orderService.findAll();
  }
  
  @Get('waiting')
  findAllWaitingOrders() {
    return this.orderService.findAllWaitingOrders();
  }
  
  @Get('canceled')
  findAllCanceledOrders() {
    return this.orderService.findAllCanceledOrders();
  }

  @Get('deliveryUserOrders/:deliveryUserId')
  deliveryUserOrders(
    @Param('deliveryUserId') deliveryUserId: string,
    // @Body() updateOrderDto: UpdateOrderDto 
  ) {
    return this.orderService.deliveryUserOrders(deliveryUserId);
  }
  
  @Get('userOrders/:userId')
  userOrders(
    @Param('userId') userId: string,
  ) {
    return this.orderService.userOrders(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(id);
  }

  @Patch(':id/assign-delivery')
  @Auth(ValidRoles.EMPLOYEE)
  async assingDeliveryUser(
    @Param('id') id: string, 
    @Body() updateOrderDto: UpdateOrderDto) {

    return this.orderService.assignDeliveryUser(id, updateOrderDto);
    
  }
 
  @Patch(':id/cancel')
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
  remove(@Param('id') id: string) {
    return this.orderService.remove(id);
  }
  
  // @Delete(':id')
  // remove2(@Param('id') id: string) {
  //   return this.orderService.remove(id);
  // }
  
}
