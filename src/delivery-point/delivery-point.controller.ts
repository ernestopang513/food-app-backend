import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DeliveryPointService } from './delivery-point.service';
import { CreateDeliveryPointDto } from './dto/create-delivery-point.dto';
import { UpdateDeliveryPointDto } from './dto/update-delivery-point.dto';
import { Auth } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces/valid-roles';

@Controller('delivery-point')
@Auth()
export class DeliveryPointController {
  constructor(private readonly deliveryPointService: DeliveryPointService) {}

  @Post()
  @Auth(ValidRoles.ADMIN)
  create(@Body() createDeliveryPointDto: CreateDeliveryPointDto) {
    return this.deliveryPointService.create(createDeliveryPointDto);
  }

  @Get()
  findAll() {
    return this.deliveryPointService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.deliveryPointService.findOne(id);
  }

  @Patch(':id')
  @Auth(ValidRoles.ADMIN)
  update(@Param('id') id: string, @Body() updateDeliveryPointDto: UpdateDeliveryPointDto) {
    return this.deliveryPointService.update(id, updateDeliveryPointDto);
  }

  @Delete(':id')
  @Auth(ValidRoles.ADMIN)
  remove(@Param('id') id: string) {
    return this.deliveryPointService.remove(id);
  }
}
