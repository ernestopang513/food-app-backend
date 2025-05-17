import { IsArray, IsEnum, IsInt, IsOptional, IsString, IsUUID, ValidateNested } from "class-validator";
import { OrderPaymentMethod } from "../enums/order-payment-method.enum";
import { OrderStatus } from "../enums/order-status.enum";
import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";


export class OrderItemDto {
    
    @ApiProperty({
        example: 'a1b2c3d4-5678-90ab-cdef-1234567890ab',
        description: 'ID del platillo',
    })
    @IsString()
    @IsUUID()
    dishId: string;

    @ApiProperty({
        example: 2,
        description: 'Cantidad del platillo solicitado',
    })
    @IsInt()
    quantity: number;

}


export class CreateOrderDto {

    @ApiProperty({
        enum: OrderPaymentMethod,
        enumName: 'OrderPaymentMethod',
        example: OrderPaymentMethod.EFECTIVO,
        description: 'Método de pago'
    })
    @IsEnum(OrderPaymentMethod)
    paymentMethod: OrderPaymentMethod;

    @ApiProperty({
        type: [OrderItemDto],
        description: 'Lista de platillos y cantidades',
    })
    @IsArray()
    @ValidateNested({ each: true})
    @Type(() => OrderItemDto)
    items: OrderItemDto[];

    @ApiProperty({
        example: 'c8aeeb0b-f04b-40c1-9294-4b37576a4959',
        description: 'ID del punto de entrega',
    })
    @IsString()
    @IsUUID()
    deliveryPoint: string;

    @ApiProperty({
        example: 'd4fe1234-abcd-4567-9876-1234567890ef',
        description: 'ID del usuario que hace la orden',
    })
    @IsString()
    @IsUUID()
    userId: string;

    @ApiProperty({
        example: '9f7e3210-aaaa-bbbb-cccc-1234567890aa',
        description: 'ID del puesto de comida',
    })
    @IsUUID()
    @IsString()
    foodStandId: string;

    @ApiProperty({
        enum: OrderStatus,
        enumName: 'OrderStatus',
        required: false,
        description: 'Estado inicial de la orden (opcional)',
    })
    @IsEnum(OrderStatus)
    @IsOptional()
    status: OrderStatus;
   
    // @IsString()
    // @IsUUID()
    // deliveryUserId: string;

}


// export class CreateOrderEmployee {

//     @IsEnum(OrderStatus)
//     status: OrderStatus;

// }


