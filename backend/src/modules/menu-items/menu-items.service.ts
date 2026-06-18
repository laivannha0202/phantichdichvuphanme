import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { MenuItem } from '../../database/entities/menu-item.entity';
import { MenuCategory } from '../../database/entities/menu-category.entity';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';
import { UpdateMenuItemStatusDto } from './dto/update-menu-item-status.dto';

@Injectable()
export class MenuItemsService {
  private readonly logger = new Logger(MenuItemsService.name);

  constructor(
    @InjectRepository(MenuItem)
    private readonly menuItemRepository: Repository<MenuItem>,
    @InjectRepository(MenuCategory)
    private readonly menuCategoryRepository: Repository<MenuCategory>,
  ) {}

  async findAll(categoryId?: number, status?: string) {
    const where: FindOptionsWhere<MenuItem> = {};

    if (categoryId) {
      where.category_id = categoryId;
    }

    if (status) {
      where.status = status;
    }

    const items = await this.menuItemRepository.find({
      where,
      relations: ['category'],
      order: { id: 'ASC' },
    });

    return { data: items, message: 'Lấy danh sách món ăn thành công' };
  }

  async findOne(id: number) {
    const item = await this.menuItemRepository.findOne({
      where: { id },
      relations: ['category'],
    });

    if (!item) {
      throw new NotFoundException(`Không tìm thấy món ăn với id ${id}`);
    }

    return { data: item, message: 'Lấy chi tiết món ăn thành công' };
  }

  async create(createMenuItemDto: CreateMenuItemDto) {
    // Validate category_id exists
    const category = await this.menuCategoryRepository.findOne({
      where: { id: createMenuItemDto.category_id },
    });

    if (!category) {
      throw new BadRequestException(
        `Không tìm thấy danh mục với id ${createMenuItemDto.category_id}`,
      );
    }

    const item = this.menuItemRepository.create({
      ...createMenuItemDto,
      status: createMenuItemDto.status || 'DANG_BAN',
    });
    const saved = await this.menuItemRepository.save(item);

    return { data: saved, message: 'Tạo món ăn thành công', statusCode: 201 };
  }

  async update(id: number, updateMenuItemDto: UpdateMenuItemDto) {
    const item = await this.menuItemRepository.findOne({ where: { id } });

    if (!item) {
      throw new NotFoundException(`Không tìm thấy món ăn với id ${id}`);
    }

    // Validate category_id if being changed
    if (updateMenuItemDto.category_id && updateMenuItemDto.category_id !== item.category_id) {
      const category = await this.menuCategoryRepository.findOne({
        where: { id: updateMenuItemDto.category_id },
      });

      if (!category) {
        throw new BadRequestException(
          `Không tìm thấy danh mục với id ${updateMenuItemDto.category_id}`,
        );
      }
    }

    Object.assign(item, updateMenuItemDto);
    const saved = await this.menuItemRepository.save(item);

    return { data: saved, message: 'Cập nhật món ăn thành công' };
  }

  async updateStatus(id: number, updateMenuItemStatusDto: UpdateMenuItemStatusDto) {
    const item = await this.menuItemRepository.findOne({ where: { id } });

    if (!item) {
      throw new NotFoundException(`Không tìm thấy món ăn với id ${id}`);
    }

    item.status = updateMenuItemStatusDto.status;
    const saved = await this.menuItemRepository.save(item);

    return { data: saved, message: 'Cập nhật trạng thái món ăn thành công' };
  }

  async remove(id: number) {
    const item = await this.menuItemRepository.findOne({ where: { id } });

    if (!item) {
      throw new NotFoundException(`Không tìm thấy món ăn với id ${id}`);
    }

    await this.menuItemRepository.remove(item);

    return { data: null, message: 'Xóa món ăn thành công' };
  }
}
