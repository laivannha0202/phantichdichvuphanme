import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Ingredient } from './ingredient.entity';
import { Supplier } from './supplier.entity';
import { User } from './user.entity';

@Entity('inventory_transactions')
export class InventoryTransaction {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'transaction_code', type: 'varchar', length: 50, unique: true })
  transactionCode!: string;

  @Column({ name: 'ingredient_id', type: 'int' })
  ingredientId!: number;

  @Column({ name: 'supplier_id', type: 'int', nullable: true })
  supplierId!: number | null;

  @Column({ type: 'varchar', length: 50 })
  type!: string;

  @Column({ type: 'decimal', precision: 12, scale: 3 })
  quantity!: number;

  @Column({ name: 'unit_price', type: 'decimal', precision: 12, scale: 2, nullable: true })
  unitPrice!: number | null;

  @Column({ name: 'total_amount', type: 'decimal', precision: 14, scale: 2, nullable: true })
  totalAmount!: number | null;

  @Column({ type: 'text', nullable: true })
  note!: string | null;

  @Column({ name: 'created_by_user_id', type: 'int', nullable: true })
  createdByUserId!: number | null;

  @CreateDateColumn({ name: 'created_at', type: 'datetime', precision: 3 })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime', precision: 3 })
  updatedAt!: Date;

  @ManyToOne(() => Ingredient, (ingredient) => ingredient.transactions)
  @JoinColumn({ name: 'ingredient_id' })
  ingredient!: Ingredient;

  @ManyToOne(() => Supplier, (supplier) => supplier.transactions)
  @JoinColumn({ name: 'supplier_id' })
  supplier!: Supplier;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'created_by_user_id' })
  createdByUser!: User;
}
