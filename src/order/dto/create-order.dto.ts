import { IsArray, IsEnum, IsInt, IsString, IsUUID, ValidateNested } from "class-validator";
import { OrderPaymentMethod } from "../enums/order-payment-method.enum";
import { OrderStatus } from "../enums/order-status.enum";
import { Type } from "class-transformer";
import { DeliveryPoint } from "src/delivery-point/entities/delivery-point.entity";


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

    @IsString()
    @IsUUID()
    deliveryPoint: string;

    @IsString()
    @IsUUID()
    userId: string;

    @IsUUID()
    @IsString()
    foodStandId: string;
   
    // @IsString()
    // @IsUUID()
    // deliveryUserId: string;

}


export class CreateOrderEmployee {

    @IsEnum(OrderStatus)
    status: OrderStatus;

}


