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

@Entity('ingredients')
export class Ingredient {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'ingredient_code', type: 'varchar', length: 50, unique: true })
  ingredientCode!: string;

  @Column({ type: 'varchar', length: 200 })
  name!: string;

  @Column({ type: 'varchar', length: 50 })
  unit!: string;

  @Column({ name: 'current_stock', type: 'decimal', precision: 12, scale: 3, default: 0 })
  currentStock!: number;

  @Column({ name: 'min_stock', type: 'decimal', precision: 12, scale: 3, default: 0 })
  minStock!: number;

  @Column({ type: 'varchar', length: 50, default: 'CON_HANG' })
  status!: string;

  @Column({ type: 'text', nullable: true })
  note!: string;

  @CreateDateColumn({ name: 'created_at', type: 'datetime', precision: 3 })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime', precision: 3 })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'datetime', precision: 3 })
  deletedAt!: Date;

  @OneToMany(() => InventoryTransaction, (transaction) => transaction.ingredient)
  transactions!: InventoryTransaction[];
}
