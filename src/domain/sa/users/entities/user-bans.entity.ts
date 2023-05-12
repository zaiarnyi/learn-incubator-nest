import { UserEntity } from '../../../users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users_banned')
export class UserBannedEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  banReason: string;

  @ManyToOne(() => UserEntity, (user) => user.id, { nullable: false })
  user: UserEntity;

  // @ManyToOne(() => BlogEntity, (blog) => blog.id, { nullable: true })
  // blog: BlogEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
