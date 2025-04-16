import { PartialType } from '@nestjs/mapped-types';
import { CreateFoodStandDto } from './create-food-stand.dto';

export class UpdateFoodStandDto extends PartialType(CreateFoodStandDto) {}
