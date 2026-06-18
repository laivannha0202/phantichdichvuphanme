import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToOne,
} from 'typeorm';
import { User } from './user.entity';

@Entity('staff')
export class Staff {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 100 })
  full_name!: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone!: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  position!: string | null;

  @Column({ type: 'varchar', length: 50, default: 'DANG_LAM' })
  status!: string;

  @CreateDateColumn({ type: 'datetime', precision: 3 })
  created_at!: Date;

  @UpdateDateColumn({ type: 'datetime', precision: 3 })
  updated_at!: Date;

  @DeleteDateColumn({ type: 'datetime', precision: 3, nullable: true })
  deleted_at!: Date | null;

  @OneToOne(() => User, (user) => user.staff)
  user!: User;
}
