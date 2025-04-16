import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FoodStandsService } from './food-stands.service';
import { CreateFoodStandDto } from './dto/create-food-stand.dto';
import { UpdateFoodStandDto } from './dto/update-food-stand.dto';

@Controller('food-stands')
export class FoodStandsController {
  constructor(private readonly foodStandsService: FoodStandsService) {}

  @Post()
  create(@Body() createFoodStandDto: CreateFoodStandDto) {
    return this.foodStandsService.create(createFoodStandDto);
  }

  @Get()
  findAll() {
    return this.foodStandsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.foodStandsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFoodStandDto: UpdateFoodStandDto) {
    return this.foodStandsService.update(+id, updateFoodStandDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.foodStandsService.remove(+id);
  }
}
