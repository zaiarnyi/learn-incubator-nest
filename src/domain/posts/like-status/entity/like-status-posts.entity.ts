import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { LikeStatusEnum } from '../../../../infrastructure/enums/like-status.enum';
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
import { PostEntity } from '../../entities/post.entity';

@Entity('post_likes')
export class PostLikesEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity, (user) => user.id)
  @JoinColumn()
  user: UserEntity;

  @ManyToOne(() => PostEntity, (post) => post.id)
  @JoinColumn()
  post: PostEntity;

  @Column({ type: 'boolean', default: false })
  like: boolean;

  @Column({ type: 'boolean', default: false })
  dislike: boolean;

  @Column({ type: 'enum', enum: LikeStatusEnum, default: LikeStatusEnum.None })
  myStatus: LikeStatusEnum;

  @Column({ type: 'boolean', default: false })
  isBanned: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
