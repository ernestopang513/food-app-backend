import { Controller, Get, Post, Body, UnauthorizedException, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { GetUser } from './decorators/get-user.decorator';
import { User } from './entities/user.entity';
import { Auth } from './decorators';
import { ValidRoles } from './interfaces/valid-roles';
import { CreateAdminDto, CreateEmployeeDto } from './dto/create-user.dto';
import { ApiResponse } from '@nestjs/swagger';
import { ApiResponses } from 'src/common/swagger/api-responses';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiResponse({ status: 201, description: 'User creado', type: User })
  @ApiResponse(ApiResponses.BadRequest)
  @ApiResponse(ApiResponses.ServerError)
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }
  
  @Post('register-employee')
  @ApiResponse({ status: 201, description: 'User employee creado', type: User })
  @ApiResponse(ApiResponses.BadRequest)
  @ApiResponse(ApiResponses.ServerError)
  createUserEmployee(@Body() createEmployeeDto: CreateEmployeeDto) {

    const {employeeKey, ...createUserDto} = createEmployeeDto;

    if(!this.authService.validateEmployeeKey(employeeKey)) {
      throw new UnauthorizedException('Clave incoreecta para crear un trabajador.')
    }
    return this.authService.createEmployee(createUserDto);
  }
  
  @Post('register-admin')
  @ApiResponse({ status: 201, description: 'User admin creado', type: User })
  @ApiResponse(ApiResponses.BadRequest)
  @ApiResponse(ApiResponses.ServerError)
  createUserAdmin(@Body() createAdminDto: CreateAdminDto) {

    const {adminKey, ...createUserDto} = createAdminDto;

    if(!this.authService.validateAdminKey(adminKey)) {
      throw new UnauthorizedException('Clave incorrecta para crear un admin.')
    }

    return this.authService.createAdmin(createUserDto);

  }

  @Post('login')
  @HttpCode(200)
  @ApiResponse({ status: 201, description: 'Login exitoso', type: User })
  @ApiResponse(ApiResponses.BadRequest)
  @ApiResponse(ApiResponses.ServerError)
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  // @Post()


  // create2(@Body() createAuthDto: CreateAuthDto) {
    //   return this.authService.create(createAuthDto);
    // }
    
  @Get('check-status')
  @Auth()
  checkAuthStatuas(
    @GetUser() user: User
  ) {
    return this.authService.checkAuthStatus(user);
  }


  @Get('private')

  @Auth(ValidRoles.ADMIN)
  privateRoute(
    @GetUser() user: User
  ) {
    return {
      ok: true,
      user
    }
  }


  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
  //   return this.authService.update(+id, updateAuthDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.authService.remove(+id);
  // }
}
