import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../database/entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll() {
    const users = await this.userRepository.find({
      relations: ['role', 'staff'],
      order: { id: 'ASC' },
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
}
