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
import { Table } from './table.entity';
import { User } from './user.entity';

@Entity('reservations')
export class Reservation {
  @ApiProperty({ description: 'ID đặt bàn', example: 1 })
  @PrimaryGeneratedColumn()
  id!: number;

  @ApiProperty({ description: 'Mã đặt bàn', example: 'RES-20260616-001' })
  @Column({ type: 'varchar', length: 50, unique: true })
  reservation_code!: string;

  @ApiProperty({ description: 'ID bàn', example: 1 })
  @Column({ type: 'int' })
  table_id!: number;

  @ApiProperty({ description: 'Tên khách hàng', example: 'Nguyễn Văn A' })
  @Column({ type: 'varchar', length: 100 })
  customer_name!: string;

  @ApiProperty({ description: 'Số điện thoại khách', example: '0901234567' })
  @Column({ type: 'varchar', length: 20 })
  customer_phone!: string;

  @ApiProperty({ description: 'Số lượng khách', example: 4 })
  @Column({ type: 'int' })
  guest_count!: number;

  @ApiProperty({ description: 'Thời gian đặt', example: '2026-06-16T18:00:00.000Z' })
  @Column({ type: 'datetime', precision: 3 })
  reservation_time!: Date;

  @ApiProperty({
    description: 'Trạng thái',
    example: 'CHO_XAC_NHAN',
    enum: ['CHO_XAC_NHAN', 'DA_XAC_NHAN', 'DA_NHAN_BAN', 'HOAN_THANH', 'KHONG_DEN', 'DA_HUY'],
  })
  @Column({ type: 'varchar', length: 50, default: 'CHO_XAC_NHAN' })
  status!: string;

  @ApiPropertyOptional({ description: 'Ghi chú', example: 'Khách yêu cầu bàn gần cửa sổ' })
  @Column({ type: 'text', nullable: true })
  note!: string | null;

  @ApiPropertyOptional({ description: 'ID người tạo', example: 1 })
  @Column({ type: 'int', nullable: true })
  created_by_user_id!: number | null;

  @ApiPropertyOptional({ description: 'Thời gian xác nhận' })
  @Column({ type: 'datetime', precision: 3, nullable: true })
  confirmed_at!: Date | null;

  @ApiPropertyOptional({ description: 'Thời gian khách nhận bàn' })
  @Column({ type: 'datetime', precision: 3, nullable: true })
  seated_at!: Date | null;

  @ApiPropertyOptional({ description: 'Thời gian hủy' })
  @Column({ type: 'datetime', precision: 3, nullable: true })
  cancelled_at!: Date | null;

  @ApiPropertyOptional({ description: 'Thời gian khách không đến' })
  @Column({ type: 'datetime', precision: 3, nullable: true })
  no_show_at!: Date | null;

  @ApiPropertyOptional({ description: 'Thời gian hoàn thành' })
  @Column({ type: 'datetime', precision: 3, nullable: true })
  completed_at!: Date | null;

  @ApiProperty({ description: 'Ngày tạo' })
  @CreateDateColumn({ type: 'datetime', precision: 3 })
  created_at!: Date;

  @ApiProperty({ description: 'Ngày cập nhật' })
  @UpdateDateColumn({ type: 'datetime', precision: 3 })
  updated_at!: Date;

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
}
