import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Role } from './role.entity';
import { Staff } from './staff.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  username!: string;

  @Column({ type: 'varchar', length: 255, select: false })
  password_hash!: string;

  @Column({ type: 'int' })
  role_id!: number;

  @Column({ type: 'int', nullable: true })
  staff_id!: number | null;

  @Column({ type: 'varchar', length: 50, default: 'ACTIVE' })
  status!: string;

  @CreateDateColumn({ type: 'datetime', precision: 3 })
  created_at!: Date;

  @UpdateDateColumn({ type: 'datetime', precision: 3 })
  updated_at!: Date;

  @DeleteDateColumn({ type: 'datetime', precision: 3, nullable: true })
  deleted_at!: Date | null;

  @ManyToOne(() => Role, (role) => role.users)
  @JoinColumn({ name: 'role_id' })
  role!: Role;

  @OneToOne(() => Staff, (staff) => staff.user)
  @JoinColumn({ name: 'staff_id' })
  staff!: Staff | null;
}
