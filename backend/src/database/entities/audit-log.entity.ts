import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'int', nullable: true })
  user_id!: number | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  username!: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  role_code!: string | null;

  @Column({ type: 'varchar', length: 80 })
  action!: string;

  @Column({ type: 'varchar', length: 100 })
  module!: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  entity_type!: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  entity_id!: string | null;

  @Column({ type: 'varchar', length: 10, nullable: true })
  method!: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  path!: string | null;

  @Column({ type: 'int', nullable: true })
  status_code!: number | null;

  @Column({ type: 'varchar', length: 64, nullable: true })
  ip_address!: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  user_agent!: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  description!: string | null;

  @Column({ type: 'json', nullable: true })
  metadata!: Record<string, any> | null;

  @CreateDateColumn({ type: 'datetime', precision: 3 })
  created_at!: Date;

  @DeleteDateColumn({ type: 'datetime', precision: 3, nullable: true })
  deleted_at!: Date | null;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'user_id' })
  user!: User | null;
}
