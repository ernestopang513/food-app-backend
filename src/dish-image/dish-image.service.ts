import { Injectable } from '@nestjs/common';
import { CreateDishImageDto } from './dto/create-dish-image.dto';
import { UpdateDishImageDto } from './dto/update-dish-image.dto';

@Injectable()
export class DishImageService {
  create(createDishImageDto: CreateDishImageDto) {
    return 'This action adds a new dishImage';
  }

  findAll() {
    return `This action returns all dishImage`;
  }

  findOne(id: number) {
    return `This action returns a #${id} dishImage`;
  }

  update(id: number, updateDishImageDto: UpdateDishImageDto) {
    return `This action updates a #${id} dishImage`;
  }

  remove(id: number) {
    return `This action removes a #${id} dishImage`;
  }
}
