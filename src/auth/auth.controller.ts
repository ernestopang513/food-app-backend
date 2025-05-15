import { Controller, Get, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { GetUser } from './decorators/get-user.decorator';
import { User } from './entities/user.entity';
import { Auth } from './decorators';
import { ValidRoles } from './interfaces/valid-roles';
import { CreateAdminDto } from './dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }
  
  @Post('register-employee')
  createUserEmployee(@Body() createUserDto: CreateUserDto) {
    return this.authService.createEmployee(createUserDto);
  }
  
  @Post('register-admin')

  createUserAdmin(@Body() createAdminDto: CreateAdminDto) {

    const {adminKey, ...createUserDto} = createAdminDto;

    if(!this.authService.validateAdminKey(adminKey)) {
      throw new UnauthorizedException('Clave incorrecta para crear un admin.')
    }

    return this.authService.createAdmin(createUserDto);

  }

  @Post('login')
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

  @Auth(ValidRoles.admin)
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
