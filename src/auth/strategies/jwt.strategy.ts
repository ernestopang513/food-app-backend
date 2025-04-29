import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-jwt";
import { User } from "../entities/user.entity";
import { JwtPayload } from "../interfaces/jwt-payload.interface";
import { InjectRepository } from "@nestjs/typeorm";



// export class JwtStrategy extends PassportStrategy( Strategy  ) {

//     constructor (

//         @InjectRepository(User)
//         private readonly userRepository: Repository<User>
//         super({
//             secretOrKey: 
//         });
//     ) {}

//     async validate(payload: JwtPayload) : Promise<User>{

//         const {email} = payload;

//         return  ;

//     }
// }