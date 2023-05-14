import { UserEntity } from '../../../users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BlogEntity } from '../../../blogs/entities/blog.entity';

@Entity('users_banned')
export class UserBannedEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  banReason: string;

  @ManyToOne(() => UserEntity, (user) => user.id, { nullable: false })
  @JoinColumn()
  user: UserEntity;

  @ManyToOne(() => BlogEntity, (blog) => blog.id, { nullable: true })
  @JoinColumn()
  blog: BlogEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
