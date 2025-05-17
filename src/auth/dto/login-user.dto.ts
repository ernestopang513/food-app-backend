


import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, isString, IsString, Matches, MaxLength, MinLength } from "class-validator";





export class LoginUserDto {

    @ApiProperty({
        example: 'usuario@example.com',
        description: 'Correo electrónico registrado del usuario',
    })
    @IsString()
    @IsEmail()
    email: string;

    @ApiProperty({
        example: 'Password123!',
        description:
            'Contraseña del usuario. Debe tener una mayúscula, una minúscula y un número o símbolo.',
        minLength: 6,
        maxLength: 50,
    })
    @IsString()
    @MinLength(6)
    @MaxLength(50)
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'The password must have a Uppercase, lowercase letter and a number'
    })
    password: string;

    
}

















