import { IsBoolean, IsLatitude, IsLongitude, IsOptional, IsString, MinLength } from "class-validator";


export class CreateDeliveryPointDto {

    @IsString()
    @MinLength(5)
    name: string;

    @IsLatitude()
    latitude: number;

    @IsLongitude()
    longitude: number;


    @IsBoolean()
    @IsOptional()
    is_active?: boolean;


}
