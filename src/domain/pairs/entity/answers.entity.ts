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
import { UserEntity } from '../../users/entities/user.entity';
import { PairsEntity } from './pairs.entity';
import { AnswersStatusesEnum } from '../enums/answers-statuses.enum';

@Entity('pair_answers')
export class PairAnswersEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity, (user) => user.id, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn()
  user: UserEntity;

  @ManyToOne(() => PairsEntity, (pair) => pair.id, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn()
  pair: PairsEntity;

  // @OneToOne(() => QuizEntity, (quiz) => quiz.id, { nullable: false, onDelete: 'CASCADE' })
  // @JoinColumn()
  // question: QuizEntity;

  @Column({ type: 'enum', enum: AnswersStatusesEnum, default: AnswersStatusesEnum.INCORRECT })
  status: AnswersStatusesEnum;

  @CreateDateColumn()
  addedAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
