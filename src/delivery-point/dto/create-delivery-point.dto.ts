import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsLatitude, IsLongitude, IsOptional, IsString, MinLength } from "class-validator";


export class CreateDeliveryPointDto {

    @ApiProperty({
        example: 'Química',
        description: 'Nombre único del puesto de comida. Debe tener al menos 3 caracteres.',
    })
    @IsString()
    @MinLength(5)
    name: string;

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
        description: 'Indica si el puesto de comida está abierto. Por defecto es true si no se proporciona.',
    })
    @IsBoolean()
    @IsOptional()
    is_active?: boolean;


}
