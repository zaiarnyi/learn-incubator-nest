import { LikeStatusEnum } from '../../../../infrastructure/enums/like-status.enum';
import { UserEntity } from '../../../users/entities/user.entity';
import { CommentsEntity } from '../../entities/comment.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('comment_likes')
export class CommentLikesEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity, (user) => user.id)
  @JoinColumn()
  user: UserEntity;

  @ManyToOne(() => CommentsEntity, (comment) => comment.id)
  @JoinColumn()
  comment: CommentsEntity;

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

  @DeleteDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
