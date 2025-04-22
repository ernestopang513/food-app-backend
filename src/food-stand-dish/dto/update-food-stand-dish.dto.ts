import { PartialType } from '@nestjs/mapped-types';
import { CreateFoodStandDishDto } from './create-food-stand-dish.dto';

export class UpdateFoodStandDishDto extends PartialType(CreateFoodStandDishDto) {}
