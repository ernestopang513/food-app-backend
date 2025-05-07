import { IsArray, IsEnum, IsInt, IsString, IsUUID, ValidateNested } from "class-validator";
import { OrderPaymentMethod } from "../enums/order-payment-method.enum";
import { OrderStatus } from "../enums/order-status.enum";
import { Type } from "class-transformer";


export class OrderItemDto {
    
    @IsString()
    @IsUUID()
    dishId: string;

    @IsInt()
    quantity: number;


}


export class CreateOrderDto {

    @IsEnum(OrderPaymentMethod)
    paymentMethod: OrderPaymentMethod;

    @IsArray()
    @ValidateNested({ each: true})
    @Type(() => OrderItemDto)
    items: OrderItemDto[];

}


export class CreateOrderEmployee {

    @IsEnum(OrderStatus)
    status: OrderStatus;

}


