import { IsInt, IsPositive, IsString, MinLength } from "class-validator";

export class CreateDishDto {

    @IsInt()
    @IsPositive()
    price: number;

    @IsString()
    @MinLength(5)
    name: string;

    @IsString()
    @MinLength(5)
    description: string;
}
