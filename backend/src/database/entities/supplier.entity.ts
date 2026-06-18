import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { InventoryTransaction } from './inventory-transaction.entity';

@Entity('suppliers')
export class Supplier {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'supplier_code', type: 'varchar', length: 50, unique: true })
  supplierCode!: string;

  @Column({ type: 'varchar', length: 200 })
  name!: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone!: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  email!: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  address!: string;

  @Column({ type: 'text', nullable: true })
  note!: string;

  @Column({ type: 'varchar', length: 50, default: 'DANG_HOP_TAC' })
  status!: string;

  @CreateDateColumn({ name: 'created_at', type: 'datetime', precision: 3 })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime', precision: 3 })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'datetime', precision: 3 })
  deletedAt!: Date;

  @OneToMany(() => InventoryTransaction, (transaction) => transaction.supplier)
  transactions!: InventoryTransaction[];
}
