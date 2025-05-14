import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderDto } from './create-order.dto';
import { OrderStatus } from '../enums/order-status.enum';
import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {

    @IsEnum(OrderStatus)
    @IsOptional()
    status: OrderStatus;

    @IsString()
    @IsUUID()
    userId: string;


}
