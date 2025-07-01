import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsBoolean, IsLatitude, IsLongitude, IsOptional, IsString, MinLength } from "class-validator";
import { FoodStandDish } from "src/food-stand-dish/entities/food-stand-dish.entity";


export class CreateFoodStandDto {

    @ApiProperty({
        example: 'Química',
        description: 'Nombre único del puesto de comida. Debe tener al menos 3 caracteres.',
    })
    @IsString()
    @MinLength(3)
    name: string;

    @ApiProperty({
        example: 'Plaza Central cerca de la Calle Principal',
        description: 'Descripción del lugar donde se encuentra el puesto. Debe tener mínimo 3 caracteres.',
    })
    @IsString()
    @MinLength(3)
    location: string;

    @ApiProperty({
        example: 40.7128,
        description: 'Coordenada de latitud del puesto de comida.',
    })
    @IsLatitude()
    latitude: number;

    @ApiProperty({
        example: -74.0060,
        description: 'Coordenada de longitud del puesto de comida.',
    })
    @IsLongitude()
    longitude: number;

    @ApiPropertyOptional({
        example: true,
        description: 'Indica si el puesto de comida está abierto. Por defecto es falso si no se proporciona.',
    })
    @IsBoolean()
    @IsOptional()
    isOpen?: boolean;

   
    // @IsOptional()
    // @IsArray()
    // foodStandDishes?: FoodStandDish[];
}