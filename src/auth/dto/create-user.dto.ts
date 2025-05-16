import { IsEmail, isString, IsString, Matches, MaxLength, MinLength } from "class-validator";





export class CreateUserDto {

    @IsString()
    @IsEmail()
    email: string;


    @IsString()
    @MinLength(6)
    @MaxLength(50)
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'The password must have a Uppercase, lowercase letter and a number'
    })
    password: string;

    @IsString()
    @MinLength(5)
    userName: string;

    @IsString()
    @MinLength(5)
    fullName: string;

    
}


export class CreateAdminDto extends CreateUserDto {

    @IsString()
    adminKey: string;
}

export class CreateEmployeeDto extends CreateUserDto {

    @IsString()
    employeeKey: string;
}

