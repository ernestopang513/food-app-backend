import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from "../entities/user.entity";
import { JwtPayload } from "../interfaces/jwt-payload.interface";
import { InjectRepository } from "@nestjs/typeorm";
import { ConfigService } from "@nestjs/config";
import { Repository } from "typeorm";
import { UnauthorizedException } from "@nestjs/common";



export class JwtStrategy extends PassportStrategy( Strategy  ) {

    constructor (

        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        configService: ConfigService

    ) {

        const jwtSecret = configService.get('JWT_SECRET') || process.env.JWT_SECRET
        if (!jwtSecret) throw new Error('JWT_SECRET is not defined');
        
        super({
            secretOrKey: jwtSecret ,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        });
        
    }

    async validate( payload: JwtPayload ): Promise<User> {
        
        const { id } = payload;

        const user = await this.userRepository.findOneBy({ id });

        if ( !user ) 
            throw new UnauthorizedException('Token not valid')
            
        if ( !user.isActive ) 
            throw new UnauthorizedException('User is inactive, talk with an admin');
        

        return user;
    }
}