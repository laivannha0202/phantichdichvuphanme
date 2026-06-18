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
import { Order } from './order.entity';
import { Payment } from './payment.entity';

@Entity('invoices')
export class Invoice {
  @ApiProperty({ description: 'ID hóa đơn', example: 1 })
  @PrimaryGeneratedColumn()
  id!: number;

  @ApiProperty({ description: 'ID đơn hàng', example: 1 })
  @Column({ type: 'int' })
  order_id!: number;

  @ApiProperty({ description: 'Mã hóa đơn', example: 'HD-20260615-001' })
  @Column({ type: 'varchar', length: 50, unique: true })
  invoice_code!: string;

  @ApiProperty({ description: 'Tạm tính', example: 100000 })
  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  subtotal!: number;

  @ApiProperty({ description: 'Thuế suất (%)', example: 10 })
  @Column({ type: 'decimal', precision: 5, scale: 2, default: 10 })
  tax_rate!: number;

  @ApiProperty({ description: 'Tiền thuế', example: 10000 })
  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  tax_amount!: number;

  @ApiProperty({ description: 'Giảm giá', example: 0 })
  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  discount!: number;

  @ApiProperty({ description: 'Tổng tiền', example: 110000 })
  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  total!: number;

  @ApiProperty({
    description: 'Trạng thái',
    example: 'CHUA_THANH_TOAN',
    enum: ['CHUA_THANH_TOAN', 'DA_THANH_TOAN', 'DA_HUY'],
  })
  @Column({ type: 'varchar', length: 50, default: 'CHUA_THANH_TOAN' })
  status!: string;

  @ApiPropertyOptional({ description: 'Ghi chú', example: 'Hóa đơn đặc biệt' })
  @Column({ type: 'text', nullable: true })
  notes!: string | null;

  @ApiProperty({ description: 'Ngày tạo' })
  @CreateDateColumn({ type: 'datetime', precision: 3 })
  created_at!: Date;

  @ApiProperty({ description: 'Ngày cập nhật' })
  @UpdateDateColumn({ type: 'datetime', precision: 3 })
  updated_at!: Date;

  @ApiPropertyOptional({ description: 'Ngày xóa mềm', nullable: true })
  @DeleteDateColumn({ type: 'datetime', precision: 3, nullable: true })
  deleted_at!: Date | null;

  @ApiProperty({ description: 'Đơn hàng', type: () => Order })
  @ManyToOne(() => Order)
  @JoinColumn({ name: 'order_id' })
  order!: Order;

  @ApiProperty({ description: 'Danh sách phiếu thanh toán', type: () => Payment })
  @OneToMany(() => Payment, (payment) => payment.invoice)
  payments!: Payment[];
}
