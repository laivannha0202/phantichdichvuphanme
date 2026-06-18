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
import { Staff } from '../../database/entities/staff.entity';
import { User } from '../../database/entities/user.entity';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';

@Injectable()
export class StaffService {
  private readonly logger = new Logger(StaffService.name);

  constructor(
    @InjectRepository(Staff)
    private staffRepository: Repository<Staff>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private dataSource: DataSource,
  ) {}

  async findAll() {
    const staff = await this.staffRepository.find({
      relations: ['user', 'user.role'],
      order: { id: 'ASC' },
      withDeleted: false,
    });

    return {
      data: staff.map((s) => ({
        id: s.id,
        fullName: s.full_name,
        phone: s.phone,
        position: s.position,
        status: s.status,
        user: s.user
          ? {
              id: s.user.id,
              username: s.user.username,
              status: s.user.status,
              role: {
                code: s.user.role.code,
                name: s.user.role.name,
              },
            }
          : null,
        createdAt: s.created_at,
        updatedAt: s.updated_at,
      })),
      message: 'Thành công',
    };
  }

  async findOne(id: number) {
    const staff = await this.staffRepository.findOne({
      where: { id },
      relations: ['user', 'user.role'],
    });

    if (!staff) {
      throw new NotFoundException('Không tìm thấy nhân viên');
    }

    return {
      data: {
        id: staff.id,
        fullName: staff.full_name,
        phone: staff.phone,
        position: staff.position,
        status: staff.status,
        user: staff.user
          ? {
              id: staff.user.id,
              username: staff.user.username,
              status: staff.user.status,
              role: {
                code: staff.user.role.code,
                name: staff.user.role.name,
              },
            }
          : null,
        createdAt: staff.created_at,
        updatedAt: staff.updated_at,
      },
      message: 'Thành công',
    };
  }

  async create(dto: CreateStaffDto, currentUser?: any) {
    // Validate nested user data
    if (!dto.user || !dto.user.username || !dto.user.password || !dto.user.role_id) {
      throw new BadRequestException('Thiếu thông tin tài khoản người dùng');
    }

    // Check duplicate username
    const existingUser = await this.userRepository.findOne({
      where: { username: dto.user.username },
    });
    if (existingUser) {
      throw new ConflictException('Tên đăng nhập đã tồn tại');
    }

    // Validate role_id exists
    const role = await this.dataSource.query(
      'SELECT id, code FROM roles WHERE id = ?',
      [dto.user.role_id],
    );
    if (!role || role.length === 0) {
      throw new BadRequestException('Vai trò không hợp lệ');
    }

    // QUAN_LY cannot create QUAN_TRI_HE_THONG users
    if (currentUser?.roleCode === 'QUAN_LY' && role[0].code === 'QUAN_TRI_HE_THONG') {
      throw new ForbiddenException('Không có quyền tạo tài khoản quản trị hệ thống');
    }

    // Validate password strength
    if (dto.user.password.length < 8) {
      throw new BadRequestException('Mật khẩu phải có ít nhất 8 ký tự');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Create staff
      const staffResult = await queryRunner.manager.insert(Staff, {
        full_name: dto.full_name,
        phone: dto.phone || null,
        position: dto.position || null,
        status: dto.status || 'DANG_LAM',
      });

      const staffId = staffResult.identifiers[0].id;

      // Hash password
      const passwordHash = await bcrypt.hash(dto.user.password, 12);

      // Create user linked to staff
      await queryRunner.manager.insert(User, {
        username: dto.user.username,
        password_hash: passwordHash,
        role_id: dto.user.role_id,
        staff_id: staffId,
        status: 'ACTIVE',
      });

      await queryRunner.commitTransaction();

      this.logger.log(`Created staff #${staffId} with user ${dto.user.username}`);

      // Return the created staff
      return this.findOne(staffId);
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async update(id: number, dto: UpdateStaffDto) {
    const staff = await this.staffRepository.findOne({ where: { id } });
    if (!staff) {
      throw new NotFoundException('Không tìm thấy nhân viên');
    }

    const updateData: Record<string, any> = {};
    if (dto.full_name !== undefined) updateData.full_name = dto.full_name;
    if (dto.phone !== undefined) updateData.phone = dto.phone;
    if (dto.position !== undefined) updateData.position = dto.position;
    if (dto.status !== undefined) updateData.status = dto.status;

    if (Object.keys(updateData).length > 0) {
      await this.staffRepository.update(id, updateData);
    }

    return this.findOne(id);
  }

  async updateStatus(id: number, status: string, currentUser?: any) {
    const validStatuses = ['DANG_LAM', 'NGHI_VIEC', 'TAM_NGHI'];
    if (!validStatuses.includes(status)) {
      throw new BadRequestException('Trạng thái không hợp lệ');
    }

    const staff = await this.staffRepository.findOne({
      where: { id },
      relations: ['user', 'user.role'],
    });
    if (!staff) {
      throw new NotFoundException('Không tìm thấy nhân viên');
    }

    await this.staffRepository.update(id, { status });

    // If staff is set to NGHI_VIEC, also deactivate user account
    if (status === 'NGHI_VIEC' && staff.user) {
      await this.userRepository.update(staff.user.id, { status: 'INACTIVE' });
    }

    // If staff is set back to DANG_LAM, reactivate user
    if (status === 'DANG_LAM' && staff.user && staff.user.status === 'INACTIVE') {
      await this.userRepository.update(staff.user.id, { status: 'ACTIVE' });
    }

    return this.findOne(id);
  }

  async remove(id: number) {
    const staff = await this.staffRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!staff) {
      throw new NotFoundException('Không tìm thấy nhân viên');
    }

    // Soft delete staff
    await this.staffRepository.softDelete(id);

    // Also soft delete the linked user if exists
    if (staff.user) {
      await this.userRepository.softDelete(staff.user.id);
    }

    return { data: null, message: 'Đã xóa nhân viên' };
  }
}
