import { BadRequestException, Injectable, InternalServerErrorException, Logger, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

//Se puede hacer patron adaptador
import * as bcrypt from 'bcrypt'
import { instanceToPlain } from 'class-transformer';
import { LoginUserDto } from './dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { UserRole } from './enums/user-role.enum';

@Injectable()
export class AuthService {

  private readonly logger = new Logger('UserService')

  constructor(

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly jwtService: JwtService,

  ) {}

  async create( createUserDto: CreateUserDto) {

    try {

      const { password, ...userData} = createUserDto;
      
      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10 )
      });

      const savedUser = await this.userRepository.save(user);

      return {
        ...instanceToPlain(savedUser),
        token: this.getJwtToken({id: user.id})
      };
    } catch (error) { 
        this.handleDBErrors(error);
    }
  }
  
  async createAdmin( createUserDto: CreateUserDto) {

    try {

      const { password, ...userData} = createUserDto;
 
      const user = this.userRepository.create({
        ...userData,
        role: UserRole.ADMIN,
        password: bcrypt.hashSync(password, 10 )
      });

      const savedUser = await this.userRepository.save(user);

      return {
        ...instanceToPlain(savedUser),
        token: this.getJwtToken({id: user.id})
      };
    } catch (error) { 
        this.handleDBErrors(error);
    }
  }
  
  async createEmployee( createUserDto: CreateUserDto) {

    try {

      const { password, ...userData} = createUserDto;
      
      const user = this.userRepository.create({
        ...userData,
        role: UserRole.EMPLOYEE,
        password: bcrypt.hashSync(password, 10 )
      });

      const savedUser = await this.userRepository.save(user);

      return {
        ...instanceToPlain(savedUser),
        token: this.getJwtToken({id: user.id})
      };
    } catch (error) { 
        this.handleDBErrors(error);
    }
  }


  async login(loginUserDto: LoginUserDto) {

    const {password, email} = loginUserDto;
    const user = await this.userRepository.findOne({
      where: {email},
      select: {email: true, password: true, id: true}
    })

    if(!user)  throw new UnauthorizedException('Credentials are not valid (email) ');

    if (!bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException('Credentials are not valid');
    // console.log(user.id)

    const {password: _password, ...userWhithoutpasword } = user;

    return {
      ...userWhithoutpasword,
      token: this.getJwtToken({id: user.id})
    };
  }

  async checkAuthStatus( user: User ) {
    return {
      ...user,
      token: this.getJwtToken({id: user.id})
    };
  }

  private getJwtToken( payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }

  // findAll() {
  //   return `This action returns all auth`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} auth`;
  // }

  // update(id: number, updateAuthDto: UpdateAuthDto) {
  //   return `This action updates a #${id} auth`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} auth`;
  // }

  validateAdminKey(key: string): boolean {
    return key === process.env.ADMIN_SECRET_KEY;
  }
  
  validateEmployeeKey(key: string): boolean {
    return key === process.env.EMPLOYEE_SECRET_KEY;
  }


  private handleDBErrors(error: any): never {
    if(error.code === '23505' ) throw new BadRequestException(error.detail);

    // console.log(error);
    this.logger.error(error);
    this.logger.log(error);
    throw new InternalServerErrorException('Please check server logs');
  }

  async deleteAllUsers () {
    const query = this.userRepository.createQueryBuilder('order');

    try {
      
      return await query
        .delete()
        .where({})
        .execute();

    } catch (error) {

      this.handleDBErrors(error);

    }
  }

   async createSeed( createUserDto: CreateUserDto) {

    try {

      const { password, ...userData} = createUserDto;
      
      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10 )
      });

      const savedUser = await this.userRepository.save(user);

      return savedUser;
      
    } catch (error) { 
        this.handleDBErrors(error);
    }

  }
}
