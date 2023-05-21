import { AfterUpdate, Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../infrastructure/database/base.entity';
import { UserEntity } from '../../users/entities/user.entity';
import { PairStatusesEnum } from '../enums/pair-statuses.enum';
import { QuizEntity } from '../../sa/quiz/entities/quiz.entity';

@Entity('pairs')
export class PairsEntity extends BaseEntity {
  @ManyToOne(() => UserEntity, (user) => user.id, { nullable: false })
  @JoinColumn()
  firstPlayer: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.id, { nullable: true })
  @JoinColumn()
  secondPlayer: UserEntity;

  @Column({ type: 'timestamp without time zone', nullable: true })
  startGameDate: Date;

  @Column({ type: 'timestamp without time zone', nullable: true })
  finishGameDate: Date;

  @Column({ type: 'enum', enum: PairStatusesEnum, default: PairStatusesEnum.PENDING_SECOND_PLAYER })
  status: PairStatusesEnum;

  @Column({ type: 'float', default: 0 })
  scoreFirstPlayer: number;

  @Column({ type: 'float', default: 0 })
  scoreSecondPlayer: number;

  @OneToMany(() => QuizEntity, (quiz) => quiz.pair, { nullable: true })
  @JoinColumn()
  questions: QuizEntity[];

  // @AfterUpdate()
  // setFinishDate() {
  //   if (this.status === PairStatusesEnum.FINISH) {
  //     this.finishGameDate = new Date();
  //   }
  // }
}
