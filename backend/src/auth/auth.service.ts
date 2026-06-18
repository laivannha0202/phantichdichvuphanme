import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from '../database/entities/user.entity';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(loginDto: LoginDto) {
    const { username, password } = loginDto;

    const user = await this.userRepository.findOne({
      where: { username },
      relations: ['role'],
      select: ['id', 'username', 'password_hash', 'status'],
    });

    if (!user) {
      throw new UnauthorizedException('Tên đăng nhập hoặc mật khẩu không đúng');
    }

    if (user.status !== 'ACTIVE') {
      throw new UnauthorizedException('Tài khoản đã bị vô hiệu hóa');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Tên đăng nhập hoặc mật khẩu không đúng');
    }

    const payload = {
      sub: user.id,
      username: user.username,
      roleCode: user.role.code,
    };

    const accessSecret = this.configService.get<string>(
      'jwt.accessSecret',
      'secret',
    );
    const accessExpiresIn = this.configService.get<string>(
      'jwt.accessExpiresIn',
      '30m',
    );
    const refreshSecret = this.configService.get<string>(
      'jwt.refreshSecret',
      'secret',
    );
    const refreshExpiresIn = this.configService.get<string>(
      'jwt.refreshExpiresIn',
      '7d',
    );

    const accessToken = this.jwtService.sign(payload, {
      secret: accessSecret,
      expiresIn: accessExpiresIn as any,
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: refreshSecret,
      expiresIn: refreshExpiresIn as any,
    });

    return {
      data: {
        accessToken,
        user: {
          id: user.id,
          username: user.username,
          role: {
            code: user.role.code,
            name: user.role.name,
          },
        },
      },
      message: 'Đăng nhập thành công',
      refreshToken,
    };
  }

  async refresh(userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['role'],
    });

    if (!user) {
      throw new UnauthorizedException('Người dùng không tồn tại');
    }

    if (user.status !== 'ACTIVE') {
      throw new UnauthorizedException('Tài khoản đã bị vô hiệu hóa');
    }

    const payload = {
      sub: user.id,
      username: user.username,
      roleCode: user.role.code,
    };

    const accessSecret = this.configService.get<string>(
      'jwt.accessSecret',
      'secret',
    );
    const accessExpiresIn = this.configService.get<string>(
      'jwt.accessExpiresIn',
      '30m',
    );
    const refreshSecret = this.configService.get<string>(
      'jwt.refreshSecret',
      'secret',
    );
    const refreshExpiresIn = this.configService.get<string>(
      'jwt.refreshExpiresIn',
      '7d',
    );

    const accessToken = this.jwtService.sign(payload, {
      secret: accessSecret,
      expiresIn: accessExpiresIn as any,
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: refreshSecret,
      expiresIn: refreshExpiresIn as any,
    });

    return {
      data: {
        accessToken,
      },
      message: 'Làm mới token thành công',
      refreshToken,
    };
  }

  async getProfile(userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['role', 'staff'],
    });

    if (!user) {
      throw new UnauthorizedException('Người dùng không tồn tại');
    }

    return {
      data: {
        id: user.id,
        username: user.username,
        role: {
          code: user.role.code,
          name: user.role.name,
        },
        staff: user.staff
          ? {
              id: user.staff.id,
              fullName: user.staff.full_name,
              phone: user.staff.phone,
              position: user.staff.position,
            }
          : null,
      },
      message: 'Thành công',
    };
  }
}
