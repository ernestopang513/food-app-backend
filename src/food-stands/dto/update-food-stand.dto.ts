// import { PartialType } from '@nestjs/mapped-types';
import { PartialType } from '@nestjs/swagger';
import { CreateFoodStandDto } from './create-food-stand.dto';

export class UpdateFoodStandDto extends PartialType(CreateFoodStandDto) {}
