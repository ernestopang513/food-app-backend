// import { PartialType } from '@nestjs/mapped-types';
import { PartialType } from '@nestjs/swagger';
import { CreateFoodStandDishDto } from './create-food-stand-dish.dto';

export class UpdateFoodStandDishDto extends PartialType(CreateFoodStandDishDto) {}
