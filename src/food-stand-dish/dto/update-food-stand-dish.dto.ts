// import { PartialType } from '@nestjs/mapped-types';
import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateFoodStandDishDto } from './create-food-stand-dish.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateFoodStandDishDto extends PartialType(CreateFoodStandDishDto) {

    @ApiPropertyOptional({
        example: true,
        description: 'Si es true, se suma la cantidad actual con la nueva'
    })
    @IsOptional()
    @IsBoolean()
    increment?: boolean;


}
