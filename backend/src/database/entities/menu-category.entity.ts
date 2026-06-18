import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { MenuItem } from './menu-item.entity';

@Entity('menu_categories')
export class MenuCategory {
  @ApiProperty({ description: 'ID danh mục', example: 1 })
  @PrimaryGeneratedColumn()
  id!: number;

  @ApiProperty({ description: 'Tên danh mục', example: 'Món khai vị' })
  @Column({ type: 'varchar', length: 100 })
  name!: string;

  @ApiProperty({ description: 'Thứ tự hiển thị', example: 1 })
  @Column({ type: 'int', default: 0 })
  sort_order!: number;

  @ApiProperty({ description: 'Ngày tạo' })
  @CreateDateColumn({ type: 'datetime', precision: 3 })
  created_at!: Date;

  @ApiProperty({ description: 'Ngày cập nhật' })
  @UpdateDateColumn({ type: 'datetime', precision: 3 })
  updated_at!: Date;

  @ApiProperty({ description: 'Ngày xóa mềm', nullable: true })
  @DeleteDateColumn({ type: 'datetime', precision: 3, nullable: true })
  deleted_at!: Date | null;

  @ApiProperty({ description: 'Danh sách món ăn', type: () => [MenuItem] })
  @OneToMany(() => MenuItem, (item) => item.category)
  menu_items!: MenuItem[];
}
