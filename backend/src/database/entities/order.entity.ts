import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Table } from './table.entity';
import { User } from './user.entity';
import { OrderItem } from './order-item.entity';

@Entity('orders')
export class Order {
  @ApiProperty({ description: 'ID đơn hàng', example: 1 })
  @PrimaryGeneratedColumn()
  id!: number;

  @ApiProperty({ description: 'ID bàn', example: 1 })
  @Column({ type: 'int' })
  table_id!: number;

  @ApiProperty({ description: 'Mã đơn', example: 'ORD-20260615-001' })
  @Column({ type: 'varchar', length: 50, unique: true })
  order_code!: string;

  @ApiProperty({
    description: 'Trạng thái',
    example: 'DANG_CHUAN_BI',
    enum: ['DANG_CHUAN_BI', 'DANG_PHUC_VU', 'HOAN_THANH', 'DA_HUY'],
  })
  @Column({ type: 'varchar', length: 50, default: 'DANG_CHUAN_BI' })
  status!: string;

  @ApiPropertyOptional({ description: 'Ghi chú', example: 'Khách yêu cầu ít cay' })
  @Column({ type: 'text', nullable: true })
  note!: string | null;

  @ApiPropertyOptional({ description: 'ID người tạo', example: 1 })
  @Column({ type: 'int', nullable: true })
  created_by_user_id!: number | null;

  @ApiProperty({ description: 'Ngày tạo' })
  @CreateDateColumn({ type: 'datetime', precision: 3 })
  created_at!: Date;

  @ApiProperty({ description: 'Ngày cập nhật' })
  @UpdateDateColumn({ type: 'datetime', precision: 3 })
  updated_at!: Date;

  @ApiPropertyOptional({ description: 'Ngày hoàn thành' })
  @Column({ type: 'datetime', precision: 3, nullable: true })
  completed_at!: Date | null;

  @ApiPropertyOptional({ description: 'Ngày hủy' })
  @Column({ type: 'datetime', precision: 3, nullable: true })
  cancelled_at!: Date | null;

  @ApiPropertyOptional({ description: 'Ngày xóa mềm', nullable: true })
  @DeleteDateColumn({ type: 'datetime', precision: 3, nullable: true })
  deleted_at!: Date | null;

  @ApiProperty({ description: 'Bàn', type: () => Table })
  @ManyToOne(() => Table)
  @JoinColumn({ name: 'table_id' })
  table!: Table;

  @ApiPropertyOptional({ description: 'Người tạo', type: () => User })
  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by_user_id' })
  created_by?: User;

  @ApiProperty({ description: 'Danh sách món', type: () => OrderItem })
  @OneToMany(() => OrderItem, (item) => item.order)
  items!: OrderItem[];
}
