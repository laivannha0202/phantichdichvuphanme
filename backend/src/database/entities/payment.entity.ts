import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Invoice } from './invoice.entity';

@Entity('payments')
export class Payment {
  @ApiProperty({ description: 'ID phiếu thanh toán', example: 1 })
  @PrimaryGeneratedColumn()
  id!: number;

  @ApiProperty({ description: 'ID hóa đơn', example: 1 })
  @Column({ type: 'int' })
  invoice_id!: number;

  @ApiProperty({
    description: 'Phương thức thanh toán',
    example: 'TIEN_MAT',
    enum: ['TIEN_MAT', 'CHUYEN_KHOAN', 'THE'],
  })
  @Column({ type: 'varchar', length: 50 })
  payment_method!: string;

  @ApiProperty({ description: 'Số tiền thanh toán', example: 110000 })
  @Column({ type: 'decimal', precision: 12, scale: 2 })
  amount!: number;

  @ApiPropertyOptional({ description: 'Mã giao dịch', example: 'GD-20260615-001' })
  @Column({ type: 'varchar', length: 100, nullable: true })
  reference_no!: string | null;

  @ApiPropertyOptional({ description: 'Ghi chú', example: 'Thanh toán tiền mặt' })
  @Column({ type: 'text', nullable: true })
  notes!: string | null;

  @ApiProperty({ description: 'Ngày tạo' })
  @CreateDateColumn({ type: 'datetime', precision: 3 })
  created_at!: Date;

  @ApiProperty({ description: 'Hóa đơn', type: () => Invoice })
  @ManyToOne(() => Invoice, (invoice) => invoice.payments)
  @JoinColumn({ name: 'invoice_id' })
  invoice!: Invoice;
}
