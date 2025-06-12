import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsUUID } from "class-validator";




export class FilterWaitingOrderDto {

    @ApiPropertyOptional({
        description: 'ID del punto de entrega',
        example: 'c8aeeb0b-f04b-40c1-9294-4b37576a4959'
    })
    @IsOptional()
    @IsUUID()
    deliveryPointId?: string;


    @ApiPropertyOptional({
        description: 'ID del foodStand',
        example: 'a1b2c3d4-e5f6-7890-abcd-1234567890ef'
    })
    @IsOptional()
    @IsUUID()
    foodStandId?: string;
}