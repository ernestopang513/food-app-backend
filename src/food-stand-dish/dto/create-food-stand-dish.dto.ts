import { IsBoolean, IsInt, isInt, IsOptional, IsPostalCode } from "class-validator";
import { FoodStand } from '../../food-stands/entities/food-stand.entity';
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";




export class CreateFoodStandDishDto {

    @ApiPropertyOptional({
        example: 30,
        description: 'Cantidad de platillos disponibles para repartir en el food stand'
    })
    @IsInt()
    @IsOptional()
    quantity?: number; 

    @ApiPropertyOptional({
        example: true,
        description: 'Indicador de si el platillo en ese food stand esta activo'
    })
    @IsBoolean()
    @IsOptional()
    is_active?: boolean;

    // @IsOptional()
    // foodStand?: FoodStand;

    
}
