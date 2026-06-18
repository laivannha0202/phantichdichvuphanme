import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuCategory } from '../../database/entities/menu-category.entity';
import { MenuItem } from '../../database/entities/menu-item.entity';
import { MenuCategoriesController } from './menu-categories.controller';
import { MenuCategoriesService } from './menu-categories.service';

@Module({
  imports: [TypeOrmModule.forFeature([MenuCategory, MenuItem])],
  controllers: [MenuCategoriesController],
  providers: [MenuCategoriesService],
  exports: [MenuCategoriesService],
})
export class MenuCategoriesModule {}
