import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../database/entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private dataSource: DataSource,
  ) {}

  async findAll() {
    const users = await this.userRepository.find({
      relations: ['role', 'staff'],
      order: { id: 'ASC' },
      withDeleted: false,
    });
    return {
      data: users.map((user) => ({
        id: user.id,
        username: user.username,
        status: user.status,
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
        createdAt: user.created_at,
        updatedAt: user.updated_at,
      })),
      message: 'Thành công',
    };
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['role', 'staff'],
    });
    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }
    return {
      data: {
        id: user.id,
        username: user.username,
        status: user.status,
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
        createdAt: user.created_at,
        updatedAt: user.updated_at,
      },
      message: 'Thành công',
    };
  }

  async create(dto: CreateUserDto, currentUser?: any) {
    // Check duplicate username
    const existingUser = await this.userRepository.findOne({
      where: { username: dto.username },
    });
    if (existingUser) {
      throw new ConflictException('Tên đăng nhập đã tồn tại');
    }

    // Validate role
    const role = await this.dataSource.query(
      'SELECT id, code FROM roles WHERE id = ?',
      [dto.role_id],
    );
    if (!role || role.length === 0) {
      throw new BadRequestException('Vai trò không hợp lệ');
    }

    // QUAN_LY cannot create QUAN_TRI_HE_THONG users
    if (currentUser?.roleCode === 'QUAN_LY' && role[0].code === 'QUAN_TRI_HE_THONG') {
      throw new ForbiddenException('Không có quyền tạo tài khoản quản trị hệ thống');
    }

    // Check staff_id uniqueness
    if (dto.staff_id) {
      const staffUser = await this.userRepository.findOne({
        where: { staff_id: dto.staff_id },
      });
      if (staffUser) {
        throw new ConflictException('Nhân viên này đã có tài khoản');
      }
    }

    // Hash password
    const passwordHash = await bcrypt.hash(dto.password, 12);

    const result = await this.userRepository.insert({
      username: dto.username,
      password_hash: passwordHash,
      role_id: dto.role_id,
      staff_id: dto.staff_id || null,
      status: dto.status || 'ACTIVE',
    });

    const userId = result.identifiers[0].id;
    this.logger.log(`Created user #${userId}: ${dto.username}`);

    return this.findOne(userId);
  }

  async update(id: number, dto: UpdateUserDto, currentUser?: any) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }

    // QUAN_LY cannot edit QUAN_TRI_HE_THONG users
    if (currentUser?.roleCode === 'QUAN_LY') {
      const userRole = await this.dataSource.query(
        'SELECT code FROM roles WHERE id = ?',
        [user.role_id],
      );
      if (userRole.length > 0 && userRole[0].code === 'QUAN_TRI_HE_THONG') {
        throw new ForbiddenException('Không có quyền chỉnh sửa tài khoản quản trị hệ thống');
      }

      // Also check they can't assign QUAN_TRI_HE_THONG
      if (dto.role_id) {
        const newRole = await this.dataSource.query(
          'SELECT code FROM roles WHERE id = ?',
          [dto.role_id],
        );
        if (newRole.length > 0 && newRole[0].code === 'QUAN_TRI_HE_THONG') {
          throw new ForbiddenException('Không có quyền gán vai trò quản trị hệ thống');
        }
      }
    }

    // Check duplicate username
    if (dto.username && dto.username !== user.username) {
      const existingUser = await this.userRepository.findOne({
        where: { username: dto.username },
      });
      if (existingUser) {
        throw new ConflictException('Tên đăng nhập đã tồn tại');
      }
    }

    // Check staff_id uniqueness
    if (dto.staff_id && dto.staff_id !== user.staff_id) {
      const staffUser = await this.userRepository.findOne({
        where: { staff_id: dto.staff_id },
      });
      if (staffUser) {
        throw new ConflictException('Nhân viên này đã có tài khoản');
      }
    }

    const updateData: Record<string, any> = {};
    if (dto.username !== undefined) updateData.username = dto.username;
    if (dto.role_id !== undefined) updateData.role_id = dto.role_id;
    if (dto.staff_id !== undefined) updateData.staff_id = dto.staff_id;
    if (dto.status !== undefined) updateData.status = dto.status;

    if (dto.password) {
      updateData.password_hash = await bcrypt.hash(dto.password, 12);
    }

    if (Object.keys(updateData).length > 0) {
      await this.userRepository.update(id, updateData);
    }

    this.logger.log(`Updated user #${id}`);
    return this.findOne(id);
  }

  async updateStatus(id: number, dto: UpdateUserStatusDto, currentUser?: any) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }

    // Admin cannot lock self
    if (currentUser?.id === id && dto.status === 'INACTIVE') {
      throw new BadRequestException('Không thể vô hiệu hóa tài khoản của chính bạn');
    }

    // QUAN_LY cannot lock QUAN_TRI_HE_THONG users
    if (currentUser?.roleCode === 'QUAN_LY') {
      const userRole = await this.dataSource.query(
        'SELECT code FROM roles WHERE id = ?',
        [user.role_id],
      );
      if (userRole.length > 0 && userRole[0].code === 'QUAN_TRI_HE_THONG') {
        throw new ForbiddenException('Không có quyền vô hiệu hóa tài khoản quản trị hệ thống');
      }
    }

    await this.userRepository.update(id, { status: dto.status });
    this.logger.log(`Updated user #${id} status to ${dto.status}`);
    return this.findOne(id);
  }

  async resetPassword(id: number, dto: ResetPasswordDto, currentUser?: any) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }

    // QUAN_LY cannot reset password of QUAN_TRI_HE_THONG users
    if (currentUser?.roleCode === 'QUAN_LY') {
      const userRole = await this.dataSource.query(
        'SELECT code FROM roles WHERE id = ?',
        [user.role_id],
      );
      if (userRole.length > 0 && userRole[0].code === 'QUAN_TRI_HE_THONG') {
        throw new ForbiddenException('Không có quyền đặt lại mật khẩu tài khoản quản trị hệ thống');
      }
    }

    const passwordHash = await bcrypt.hash(dto.new_password, 12);
    await this.userRepository.update(id, { password_hash: passwordHash });
    this.logger.log(`Reset password for user #${id}`);
    return { data: null, message: 'Đặt lại mật khẩu thành công' };
  }

  async updateRole(id: number, dto: UpdateUserRoleDto, currentUser?: any) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }

    // QUAN_LY cannot change role of QUAN_TRI_HE_THONG users
    if (currentUser?.roleCode === 'QUAN_LY') {
      const userRole = await this.dataSource.query(
        'SELECT code FROM roles WHERE id = ?',
        [user.role_id],
      );
      if (userRole.length > 0 && userRole[0].code === 'QUAN_TRI_HE_THONG') {
        throw new ForbiddenException('Không có quyền thay đổi vai trò của quản trị hệ thống');
      }

      // QUAN_LY cannot assign QUAN_TRI_HE_THONG role
      const newRole = await this.dataSource.query(
        'SELECT code FROM roles WHERE id = ?',
        [dto.role_id],
      );
      if (newRole.length > 0 && newRole[0].code === 'QUAN_TRI_HE_THONG') {
        throw new ForbiddenException('Không có quyền gán vai trò quản trị hệ thống');
      }
    }

    // Validate role exists
    const role = await this.dataSource.query(
      'SELECT id FROM roles WHERE id = ?',
      [dto.role_id],
    );
    if (!role || role.length === 0) {
      throw new BadRequestException('Vai trò không hợp lệ');
    }

    await this.userRepository.update(id, { role_id: dto.role_id });
    this.logger.log(`Updated role for user #${id}`);
    return this.findOne(id);
  }

  async updatePassword(id: number, dto: UpdatePasswordDto, currentUser?: any) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }

    // QUAN_LY cannot change password of QUAN_TRI_HE_THONG users
    if (currentUser?.roleCode === 'QUAN_LY') {
      const userRole = await this.dataSource.query(
        'SELECT code FROM roles WHERE id = ?',
        [user.role_id],
      );
      if (userRole.length > 0 && userRole[0].code === 'QUAN_TRI_HE_THONG') {
        throw new ForbiddenException('Không có quyền đổi mật khẩu quản trị hệ thống');
      }
    }

    const passwordHash = await bcrypt.hash(dto.new_password, 12);
    await this.userRepository.update(id, { password_hash: passwordHash });
    this.logger.log(`Updated password for user #${id}`);
    return { data: null, message: 'Đổi mật khẩu thành công' };
  }

  async remove(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }
    await this.userRepository.softDelete(id);
    this.logger.log(`Soft deleted user #${id}`);
    return { data: null, message: 'Đã xóa người dùng' };
  }
}
