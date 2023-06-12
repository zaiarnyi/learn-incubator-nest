import { UserRoles } from '../../auth/enums/roles.enum';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Generated,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ collation: 'C' })
  login: string;

  @Column({ collation: 'C' })
  email: string;

  @Column()
  passwordHash: string;

  @Column({ default: false, type: 'boolean' })
  isConfirm: boolean;

  @Column({ default: false, type: 'boolean' })
  isSendEmail: boolean;

  @Column({ type: 'enum', enum: UserRoles, default: UserRoles.USER })
  role: UserRoles;

  @Column({ default: false, type: 'boolean' })
  isBanned: boolean;

  @Column()
  @Generated('uuid')
  uuid: string;

  @Column({ nullable: true, type: 'bigint' })
  telegramId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
