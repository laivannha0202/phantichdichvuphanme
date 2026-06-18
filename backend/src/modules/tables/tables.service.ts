import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { Table } from '../../database/entities/table.entity';
import { TableArea } from '../../database/entities/table-area.entity';
import { CreateTableDto } from './dto/create-table.dto';
import { UpdateTableDto } from './dto/update-table.dto';
import { UpdateTableStatusDto } from './dto/update-table-status.dto';

// Business rules: valid status transitions
const VALID_TABLE_TRANSITIONS: Record<string, string[]> = {
  TRONG: ['DA_DAT', 'CO_KHACH', 'BAO_TRI'],
  DA_DAT: ['CO_KHACH', 'TRONG', 'BAO_TRI'],
  CO_KHACH: ['DANG_DON'],
  DANG_DON: ['TRONG'],
  BAO_TRI: ['TRONG'],
};

@Injectable()
export class TablesService {
  private readonly logger = new Logger(TablesService.name);

  constructor(
    @InjectRepository(Table)
    private readonly tableRepository: Repository<Table>,
    @InjectRepository(TableArea)
    private readonly tableAreaRepository: Repository<TableArea>,
  ) {}

  async findAll(tableAreaId?: number, status?: string) {
    const where: FindOptionsWhere<Table> = {};

    if (tableAreaId) {
      where.table_area_id = tableAreaId;
    }

    if (status) {
      where.status = status;
    }

    const tables = await this.tableRepository.find({
      where,
      relations: ['table_area'],
      order: { id: 'ASC' },
    });

    return { data: tables, message: 'Lấy danh sách bàn thành công' };
  }

  async findOne(id: number) {
    const table = await this.tableRepository.findOne({
      where: { id },
      relations: ['table_area'],
    });

    if (!table) {
      throw new NotFoundException(`Không tìm thấy bàn với id ${id}`);
    }

    return { data: table, message: 'Lấy chi tiết bàn thành công' };
  }

  async create(createTableDto: CreateTableDto) {
    // Validate table_area_id exists
    const area = await this.tableAreaRepository.findOne({
      where: { id: createTableDto.table_area_id },
    });

    if (!area) {
      throw new BadRequestException(
        `Không tìm thấy khu vực với id ${createTableDto.table_area_id}`,
      );
    }

    const table = this.tableRepository.create({
      ...createTableDto,
      status: createTableDto.status || 'TRONG',
    });
    const saved = await this.tableRepository.save(table);

    return { data: saved, message: 'Tạo bàn thành công', statusCode: 201 };
  }

  async update(id: number, updateTableDto: UpdateTableDto) {
    const table = await this.tableRepository.findOne({ where: { id } });

    if (!table) {
      throw new NotFoundException(`Không tìm thấy bàn với id ${id}`);
    }

    // Validate table_area_id if being changed
    if (updateTableDto.table_area_id && updateTableDto.table_area_id !== table.table_area_id) {
      const area = await this.tableAreaRepository.findOne({
        where: { id: updateTableDto.table_area_id },
      });

      if (!area) {
        throw new BadRequestException(
          `Không tìm thấy khu vực với id ${updateTableDto.table_area_id}`,
        );
      }
    }

    Object.assign(table, updateTableDto);
    const saved = await this.tableRepository.save(table);

    return { data: saved, message: 'Cập nhật bàn thành công' };
  }

  async updateStatus(id: number, updateTableStatusDto: UpdateTableStatusDto) {
    const table = await this.tableRepository.findOne({ where: { id } });

    if (!table) {
      throw new NotFoundException(`Không tìm thấy bàn với id ${id}`);
    }

    const { status: newStatus } = updateTableStatusDto;
    const currentStatus = table.status;

    // Check valid transition
    const allowedTransitions = VALID_TABLE_TRANSITIONS[currentStatus];
    if (!allowedTransitions || !allowedTransitions.includes(newStatus)) {
      throw new BadRequestException(
        `Không thể chuyển trạng thái từ "${currentStatus}" sang "${newStatus}". ` +
        `Trạng thái hợp lệ: ${allowedTransitions?.join(', ') || 'không có'}`,
      );
    }

    table.status = newStatus;
    const saved = await this.tableRepository.save(table);

    return { data: saved, message: 'Cập nhật trạng thái bàn thành công' };
  }

  async remove(id: number) {
    const table = await this.tableRepository.findOne({ where: { id } });

    if (!table) {
      throw new NotFoundException(`Không tìm thấy bàn với id ${id}`);
    }

    await this.tableRepository.remove(table);

    return { data: null, message: 'Xóa bàn thành công' };
  }
}
