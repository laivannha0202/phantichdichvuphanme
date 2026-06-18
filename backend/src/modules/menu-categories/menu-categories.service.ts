import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MenuCategory } from '../../database/entities/menu-category.entity';
import { CreateMenuCategoryDto } from './dto/create-menu-category.dto';
import { UpdateMenuCategoryDto } from './dto/update-menu-category.dto';

@Injectable()
export class MenuCategoriesService {
  private readonly logger = new Logger(MenuCategoriesService.name);

  constructor(
    @InjectRepository(MenuCategory)
    private readonly menuCategoryRepository: Repository<MenuCategory>,
  ) {}

  async findAll() {
    const categories = await this.menuCategoryRepository.find({
      order: { sort_order: 'ASC', id: 'ASC' },
    });
    return { data: categories, message: 'Lấy danh sách danh mục thành công' };
  }

  async findOne(id: number) {
    const category = await this.menuCategoryRepository.findOne({
      where: { id },
      relations: ['menu_items'],
    });

    if (!category) {
      throw new NotFoundException(`Không tìm thấy danh mục với id ${id}`);
    }

    return { data: category, message: 'Lấy chi tiết danh mục thành công' };
  }

  async create(createMenuCategoryDto: CreateMenuCategoryDto) {
    // Check unique name
    const existing = await this.menuCategoryRepository.findOne({
      where: { name: createMenuCategoryDto.name },
    });

    if (existing) {
      throw new ConflictException(`Danh mục "${createMenuCategoryDto.name}" đã tồn tại`);
    }

    const category = this.menuCategoryRepository.create(createMenuCategoryDto);
    const saved = await this.menuCategoryRepository.save(category);

    return { data: saved, message: 'Tạo danh mục thành công', statusCode: 201 };
  }

  async update(id: number, updateMenuCategoryDto: UpdateMenuCategoryDto) {
    const category = await this.menuCategoryRepository.findOne({ where: { id } });

    if (!category) {
      throw new NotFoundException(`Không tìm thấy danh mục với id ${id}`);
    }

    // Check unique name if name is being changed
    if (updateMenuCategoryDto.name && updateMenuCategoryDto.name !== category.name) {
      const existing = await this.menuCategoryRepository.findOne({
        where: { name: updateMenuCategoryDto.name },
      });

      if (existing) {
        throw new ConflictException(`Danh mục "${updateMenuCategoryDto.name}" đã tồn tại`);
      }
    }

    Object.assign(category, updateMenuCategoryDto);
    const saved = await this.menuCategoryRepository.save(category);

    return { data: saved, message: 'Cập nhật danh mục thành công' };
  }

  async remove(id: number) {
    const category = await this.menuCategoryRepository.findOne({
      where: { id },
      relations: ['menu_items'],
    });

    if (!category) {
      throw new NotFoundException(`Không tìm thấy danh mục với id ${id}`);
    }

    // Check if category has items
    if (category.menu_items && category.menu_items.length > 0) {
      throw new BadRequestException(
        `Không thể xóa danh mục "${category.name}" vì còn ${category.menu_items.length} món thuộc danh mục`,
      );
    }

    await this.menuCategoryRepository.remove(category);

    return { data: null, message: 'Xóa danh mục thành công' };
  }
}
