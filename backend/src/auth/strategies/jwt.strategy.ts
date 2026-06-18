import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../database/entities/user.entity';

interface JwtPayload {
  sub: number;
  username: string;
  roleCode: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    configService: ConfigService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:
        configService.get<string>('jwt.accessSecret') || 'fallback-secret',
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.userRepository.findOne({
      where: { id: payload.sub },
    });
    if (!user) {
      throw new UnauthorizedException(
        'Người dùng không tồn tại hoặc đã bị vô hiệu hóa',
      );
    }
    if (user.status !== 'ACTIVE') {
      throw new UnauthorizedException('Tài khoản đã bị vô hiệu hóa');
    }
    return {
      id: payload.sub,
      username: payload.username,
      roleCode: payload.roleCode,
    };
  }
}
