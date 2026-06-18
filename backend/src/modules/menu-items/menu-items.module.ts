import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuItem } from '../../database/entities/menu-item.entity';
import { MenuCategory } from '../../database/entities/menu-category.entity';
import { MenuItemsController } from './menu-items.controller';
import { MenuItemsService } from './menu-items.service';

@Module({
  imports: [TypeOrmModule.forFeature([MenuItem, MenuCategory])],
  controllers: [MenuItemsController],
  providers: [MenuItemsService],
  exports: [MenuItemsService],
})
export class MenuItemsModule {}
