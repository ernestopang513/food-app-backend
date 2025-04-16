import { IsBoolean, IsLatitude, IsLongitude, IsString, MinLength } from "class-validator";


export class CreateFoodStandDto {

    @IsString()
    @MinLength(3)
    name: string;

    @IsString()
    @MinLength(3)
    location: string;

    @IsLatitude()
    latitude:number;

    @IsLongitude()
    longitude: number;

}
