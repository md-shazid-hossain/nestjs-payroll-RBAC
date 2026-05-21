import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Users } from 'src/users/users.entity';
import { Repository } from 'typeorm';

export interface JwtPayload {
  id: number;
  email: string;
  roles: string[];
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(Users)
    private userRepository: Repository<Users>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'your-secret-key',
    });
  }
  
  // async validate(payload: JwtPayload): Promise<JwtPayload> {
  //   if (!payload.roles || payload.roles.length === 0) {
  //     throw new UnauthorizedException('User has no roles assigned');
  //   }
  //   return payload;
  // }

  async validate(payload: any) {
    return this.userRepository.findOne({
      where: { id: payload.id },
      relations: ['roles', 'roles.permissions'],
    });
  }
}
