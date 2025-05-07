import { IsInt, IsPositive } from "class-validator";






export class CreateOrderDishDto {

    @IsInt()
    @IsPositive()
    quantity: number;
    
}