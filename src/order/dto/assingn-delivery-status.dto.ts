import { IsEnum, IsOptional, IsUUID } from "class-validator";
import { OrderStatus } from "../enums/order-status.enum";




export class AssignDeliveryDto {

    @IsUUID()
    userId: string;

    @IsOptional()
    @IsEnum(OrderStatus)
    status?: OrderStatus;
}