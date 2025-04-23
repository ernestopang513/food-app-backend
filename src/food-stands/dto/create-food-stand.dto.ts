import { IsArray, IsBoolean, IsLatitude, IsLongitude, IsOptional, IsString, MinLength } from "class-validator";
import { FoodStandDish } from "src/food-stand-dish/entities/food-stand-dish.entity";


export class CreateFoodStandDto {

    @IsString()
    @MinLength(3)
    name: string;

    @IsString()
    @MinLength(3)
    location: string;

    @IsLatitude()
    latitude:number;

    @IsLongitude()
    longitude: number;

    @IsBoolean()
    @IsOptional()
    is_open?: boolean;

    @IsOptional()
    @IsArray()
    foodStandDishes?: FoodStandDish[];

    



}
