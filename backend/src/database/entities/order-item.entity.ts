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
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Order } from './order.entity';
import { MenuItem } from './menu-item.entity';

@Entity('order_items')
export class OrderItem {
  @ApiProperty({ description: 'ID món trong đơn', example: 1 })
  @PrimaryGeneratedColumn()
  id!: number;

  @ApiProperty({ description: 'ID đơn hàng', example: 1 })
  @Column({ type: 'int' })
  order_id!: number;

  @ApiProperty({ description: 'ID món ăn', example: 1 })
  @Column({ type: 'int' })
  menu_item_id!: number;

  @ApiProperty({ description: 'Số lượng', example: 2 })
  @Column({ type: 'int', default: 1 })
  quantity!: number;

  @ApiProperty({ description: 'Đơn giá tại thời điểm gọi', example: 65000 })
  @Column({ type: 'decimal', precision: 12, scale: 2 })
  unit_price!: number;

  @ApiPropertyOptional({ description: 'Ghi chú', example: 'Ít cay' })
  @Column({ type: 'text', nullable: true })
  note!: string | null;

  @ApiProperty({
    description: 'Trạng thái',
    example: 'CHO_CHE_BIEN',
    enum: ['CHO_CHE_BIEN', 'DANG_CHE_BIEN', 'HOAN_THANH', 'DA_PHUC_VU', 'DA_HUY'],
  })
  @Column({ type: 'varchar', length: 50, default: 'CHO_CHE_BIEN' })
  status!: string;

  @ApiProperty({ description: 'Ngày tạo' })
  @CreateDateColumn({ type: 'datetime', precision: 3 })
  created_at!: Date;

  @ApiProperty({ description: 'Ngày cập nhật' })
  @UpdateDateColumn({ type: 'datetime', precision: 3 })
  updated_at!: Date;

  @ApiPropertyOptional({ description: 'Ngày hủy' })
  @Column({ type: 'datetime', precision: 3, nullable: true })
  cancelled_at!: Date | null;

  @ApiPropertyOptional({ description: 'Ngày xóa mềm', nullable: true })
  @DeleteDateColumn({ type: 'datetime', precision: 3, nullable: true })
  deleted_at!: Date | null;

  @ApiProperty({ description: 'Đơn hàng', type: () => Order })
  @ManyToOne(() => Order, (order) => order.items)
  @JoinColumn({ name: 'order_id' })
  order!: Order;

  @ApiProperty({ description: 'Món ăn', type: () => MenuItem })
  @ManyToOne(() => MenuItem)
  @JoinColumn({ name: 'menu_item_id' })
  menu_item!: MenuItem;
}
