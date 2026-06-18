import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { MenuCategory } from './menu-category.entity';

@Entity('menu_items')
export class MenuItem {
  @ApiProperty({ description: 'ID món ăn', example: 1 })
  @PrimaryGeneratedColumn()
  id!: number;

  @ApiProperty({ description: 'ID danh mục', example: 1 })
  @Column({ type: 'int' })
  category_id!: number;

  @ApiProperty({ description: 'Tên món', example: 'Phở Bò' })
  @Column({ type: 'varchar', length: 200 })
  name!: string;

  @ApiProperty({ description: 'Mô tả', example: 'Phở bò truyền thống', nullable: true })
  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @ApiProperty({ description: 'Giá bán', example: 65000 })
  @Column({ type: 'decimal', precision: 12, scale: 2 })
  price!: number;

  @ApiProperty({ description: 'Giá vốn', example: 30000, nullable: true })
  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  cost_price!: number | null;

  @ApiProperty({ description: 'URL ảnh', example: '/images/pho-bo.jpg', nullable: true })
  @Column({ type: 'varchar', length: 500, nullable: true })
  image_url!: string | null;

  @ApiProperty({ description: 'Trạng thái', example: 'DANG_BAN', enum: ['DANG_BAN', 'HET_MON', 'NGUNG_BAN'] })
  @Column({ type: 'varchar', length: 50, default: 'DANG_BAN' })
  status!: string;

  @ApiProperty({ description: 'Ngày tạo' })
  @CreateDateColumn({ type: 'datetime', precision: 3 })
  created_at!: Date;

  @ApiProperty({ description: 'Ngày cập nhật' })
  @UpdateDateColumn({ type: 'datetime', precision: 3 })
  updated_at!: Date;

  @ApiProperty({ description: 'Ngày xóa mềm', nullable: true })
  @DeleteDateColumn({ type: 'datetime', precision: 3, nullable: true })
  deleted_at!: Date | null;

  @ApiProperty({ description: 'Danh mục', type: () => MenuCategory })
  @ManyToOne(() => MenuCategory, (category) => category.menu_items)
  @JoinColumn({ name: 'category_id' })
  category!: MenuCategory;
}
