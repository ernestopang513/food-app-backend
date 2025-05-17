import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsPositive, IsString, MinLength } from "class-validator";

export class CreateDishDto {

    @ApiProperty({
        example: 55,
        description: 'Precio del platillo'
    })
    @IsInt()
    @IsPositive()
    price: number;

    @ApiProperty({
        example: 'Pollo Mango Habanero',
        description: 'Nombre del platillo de comida. Debe de tener minimo 5 caracteres'
    })
    @IsString()
    @MinLength(5)
    name: string;

    @ApiProperty({
        example: 'Pollo sazonado de forma muy rica',
        description: 'Descripción de sabores y contenido del platillo'
    })
    @IsString()
    @MinLength(5)
    description: string;
}
