import { IsBoolean, IsInt, isInt, IsOptional, IsPostalCode } from "class-validator";
import { FoodStand } from '../../food-stands/entities/food-stand.entity';




export class CreateFoodStandDishDto {

    @IsInt()
    @IsOptional()
    quantity?: number; 

    @IsBoolean()
    @IsOptional()
    is_active?: boolean;

    // @IsOptional()
    // foodStand?: FoodStand;

    
}
