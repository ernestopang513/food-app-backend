import { IsString, IsUrl } from "class-validator";

export class CreateDishImageDto {

    @IsString()
    @IsUrl()
    url_image: string
    

}
