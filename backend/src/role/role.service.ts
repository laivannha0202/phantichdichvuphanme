import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../database/entities/role.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  async findAll() {
    const roles = await this.roleRepository.find({
      order: { id: 'ASC' },
    });
    return {
      data: roles.map((role) => ({
        id: role.id,
        code: role.code,
        name: role.name,
      })),
      message: 'Thành công',
    };
  }

  async findOne(id: number) {
    const role = await this.roleRepository.findOne({ where: { id } });
    if (!role) {
      throw new NotFoundException('Không tìm thấy vai trò');
    }
    return {
      data: {
        id: role.id,
        code: role.code,
        name: role.name,
      },
      message: 'Thành công',
    };
  }

  async findByCode(code: string) {
    return this.roleRepository.findOne({ where: { code } });
  }
}
