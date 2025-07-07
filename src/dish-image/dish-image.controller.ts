import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DishImageService } from './dish-image.service';
import { CreateDishImageDto } from './dto/create-dish-image.dto';
import { UpdateDishImageDto } from './dto/update-dish-image.dto';

@Controller('dish-image')
export class DishImageController {
  constructor(private readonly dishImageService: DishImageService) { }

  @Post(':dishId')
  create(
    @Body() createDishImageDto: CreateDishImageDto,
    @Param('dishId') dishId: string,
  ) {
    return this.dishImageService.create(dishId, createDishImageDto);
  }

  // @Get()
  // findAll() {
  //   return this.dishImageService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.dishImageService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateDishImageDto: UpdateDishImageDto) {
  //   return this.dishImageService.update(+id, updateDishImageDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dishImageService.remove(id);
  }
}
