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
import { TableArea } from './table-area.entity';

@Entity('tables')
export class Table {
  @ApiProperty({ description: 'ID bàn', example: 1 })
  @PrimaryGeneratedColumn()
  id!: number;

  @ApiProperty({ description: 'ID khu vực', example: 1 })
  @Column({ type: 'int' })
  table_area_id!: number;

  @ApiProperty({ description: 'Tên bàn', example: 'B01' })
  @Column({ type: 'varchar', length: 50 })
  name!: string;

  @ApiProperty({ description: 'Sức chứa', example: 4 })
  @Column({ type: 'smallint', default: 4 })
  capacity!: number;

  @ApiProperty({ description: 'Trạng thái', example: 'TRONG', enum: ['TRONG', 'DA_DAT', 'CO_KHACH', 'DANG_DON', 'BAO_TRI'] })
  @Column({ type: 'varchar', length: 50, default: 'TRONG' })
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

  @ApiProperty({ description: 'Khu vực', type: () => TableArea })
  @ManyToOne(() => TableArea, (area) => area.tables)
  @JoinColumn({ name: 'table_area_id' })
  table_area!: TableArea;
}
