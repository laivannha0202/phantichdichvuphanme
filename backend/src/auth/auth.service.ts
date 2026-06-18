import {
  Injectable,
  UnauthorizedException,
  Logger,
  Inject,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
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
    private readonly dataSource: DataSource,
  ) {}

  private async writeAuditLog(entry: {
    user_id: number | null;
    username: string | null;
    role_code: string | null;
    action: string;
    module: string;
    description?: string;
    metadata?: Record<string, any> | null;
  }): Promise<void> {
    try {
      await this.dataSource.query(
        `INSERT INTO audit_logs
          (user_id, username, role_code, action, module, description, metadata)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          entry.user_id,
          entry.username,
          entry.role_code,
          entry.action,
          entry.module,
          entry.description ?? null,
          entry.metadata ? JSON.stringify(entry.metadata) : null,
        ],
      );
    } catch (error: any) {
      this.logger.error(`Failed to write audit log: ${error.message}`);
    }
  }

  async login(loginDto: LoginDto) {
    const { username, password } = loginDto;

    const user = await this.userRepository.findOne({
      where: { username },
      relations: ['role'],
      select: ['id', 'username', 'password_hash', 'status'],
    });

    if (!user) {
      await this.writeAuditLog({
        user_id: null,
        username,
        role_code: null,
        action: 'LOGIN_FAILED',
        module: 'AUTH',
        description: `Đăng nhập thất bại — sai tên đăng nhập`,
      });
      throw new UnauthorizedException('Tên đăng nhập hoặc mật khẩu không đúng');
    }

    if (user.status !== 'ACTIVE') {
      await this.writeAuditLog({
        user_id: user.id,
        username: user.username,
        role_code: user.role?.code ?? null,
        action: 'LOGIN_FAILED',
        module: 'AUTH',
        description: `Đăng nhập thất bại — tài khoản bị vô hiệu hóa`,
      });
      throw new UnauthorizedException('Tài khoản đã bị vô hiệu hóa');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      await this.writeAuditLog({
        user_id: user.id,
        username: user.username,
        role_code: user.role?.code ?? null,
        action: 'LOGIN_FAILED',
        module: 'AUTH',
        description: `Đăng nhập thất bại — sai mật khẩu`,
      });
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

    // Ghi audit log thành công
    await this.writeAuditLog({
      user_id: user.id,
      username: user.username,
      role_code: user.role.code,
      action: 'LOGIN_SUCCESS',
      module: 'AUTH',
      description: `Đăng nhập thành công`,
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

    const refreshSecret = this.configService.get<string>(
      'jwt.refreshSecret',
      'secret',
    );
    const refreshExpiresIn = this.configService.get<string>(
      'jwt.refreshExpiresIn',
      '7d',
    );

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('jwt.accessSecret', 'secret'),
      expiresIn: this.configService.get<string>('jwt.accessExpiresIn', '30m') as any,
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
