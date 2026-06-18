import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Table } from './table.entity';

@Entity('table_areas')
export class TableArea {
  @ApiProperty({ description: 'ID khu vực', example: 1 })
  @PrimaryGeneratedColumn()
  id!: number;

  @ApiProperty({ description: 'Tên khu vực', example: 'Tầng 1' })
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

  @ApiProperty({ description: 'Danh sách bàn', type: () => [Table] })
  @OneToMany(() => Table, (table) => table.table_area)
  tables!: Table[];
}
