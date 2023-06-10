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
import { BlogEntity } from './blog.entity';
import { UserEntity } from '../../users/entities/user.entity';
import { SubscriptionStatusEnum } from '../enums/subscription-status.enum';

@Entity('blog_subscriptions')
export class SubscriptionUsersBlogsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => BlogEntity, (blog) => blog.id)
  @JoinColumn()
  blog: BlogEntity;

  @ManyToOne(() => UserEntity, (user) => user.id)
  @JoinColumn()
  user: UserEntity;

  @Column({ type: 'enum', enum: SubscriptionStatusEnum, nullable: false })
  status: SubscriptionStatusEnum;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
