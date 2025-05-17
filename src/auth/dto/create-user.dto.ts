import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, isString, IsString, Matches, MaxLength, MinLength } from "class-validator";





export class CreateUserDto {

    @ApiProperty({
        example: 'usuario@example.com',
        description: 'Correo electrónico del usuario',
        uniqueItems: true,
    })
    @IsString()
    @IsEmail()
    email: string;

    @ApiProperty({
        example: 'Pass123!',
        description:
            'Contraseña que debe tener al menos una mayúscula, una minúscula, un número o símbolo',
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

    @ApiProperty({
        example: 'user_juan',
        description: 'Nombre de usuario único del sistema',
        minLength: 5,
    })
    @IsString()
    @MinLength(5)
    userName: string;

    @ApiProperty({
        example: 'Juan Pérez',
        description: 'Nombre completo del usuario',
        minLength: 5,
    })
    @IsString()
    @MinLength(5)
    fullName: string;

    
}


export class CreateAdminDto extends CreateUserDto {

    @ApiProperty({
        example: 'ADM123KEY',
        description: 'Clave de autenticación especial para registrar un admin',
    })
    @IsString()
    adminKey: string;
}

export class CreateEmployeeDto extends CreateUserDto {

    @ApiProperty({
        example: 'EMP456KEY',
        description: 'Clave de autenticación para registrar un empleado',
    })
    @IsString()
    employeeKey: string;
}

