import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TableArea } from '../../database/entities/table-area.entity';
import { CreateTableAreaDto } from './dto/create-table-area.dto';
import { UpdateTableAreaDto } from './dto/update-table-area.dto';

@Injectable()
export class TableAreasService {
  private readonly logger = new Logger(TableAreasService.name);

  constructor(
    @InjectRepository(TableArea)
    private readonly tableAreaRepository: Repository<TableArea>,
  ) {}

  async findAll() {
    const areas = await this.tableAreaRepository.find({
      order: { sort_order: 'ASC', id: 'ASC' },
    });
    return { data: areas, message: 'Lấy danh sách khu vực thành công' };
  }

  async findOne(id: number) {
    const area = await this.tableAreaRepository.findOne({
      where: { id },
      relations: ['tables'],
    });

    if (!area) {
      throw new NotFoundException(`Không tìm thấy khu vực với id ${id}`);
    }

    return { data: area, message: 'Lấy chi tiết khu vực thành công' };
  }

  async create(createTableAreaDto: CreateTableAreaDto) {
    // Check unique name
    const existing = await this.tableAreaRepository.findOne({
      where: { name: createTableAreaDto.name },
    });

    if (existing) {
      throw new ConflictException(`Khu vực "${createTableAreaDto.name}" đã tồn tại`);
    }

    const area = this.tableAreaRepository.create(createTableAreaDto);
    const saved = await this.tableAreaRepository.save(area);

    return { data: saved, message: 'Tạo khu vực thành công', statusCode: 201 };
  }

  async update(id: number, updateTableAreaDto: UpdateTableAreaDto) {
    const area = await this.tableAreaRepository.findOne({ where: { id } });

    if (!area) {
      throw new NotFoundException(`Không tìm thấy khu vực với id ${id}`);
    }

    // Check unique name if name is being changed
    if (updateTableAreaDto.name && updateTableAreaDto.name !== area.name) {
      const existing = await this.tableAreaRepository.findOne({
        where: { name: updateTableAreaDto.name },
      });

      if (existing) {
        throw new ConflictException(`Khu vực "${updateTableAreaDto.name}" đã tồn tại`);
      }
    }

    Object.assign(area, updateTableAreaDto);
    const saved = await this.tableAreaRepository.save(area);

    return { data: saved, message: 'Cập nhật khu vực thành công' };
  }

  async remove(id: number) {
    const area = await this.tableAreaRepository.findOne({
      where: { id },
      relations: ['tables'],
    });

    if (!area) {
      throw new NotFoundException(`Không tìm thấy khu vực với id ${id}`);
    }

    // Check if area has tables
    if (area.tables && area.tables.length > 0) {
      throw new BadRequestException(
        `Không thể xóa khu vực "${area.name}" vì còn ${area.tables.length} bàn thuộc khu vực`,
      );
    }

    await this.tableAreaRepository.remove(area);

    return { data: null, message: 'Xóa khu vực thành công' };
  }
}
