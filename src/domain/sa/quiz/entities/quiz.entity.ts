import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../../infrastructure/database/base.entity';
import { PairsEntity } from '../../../pairs/entity/pairs.entity';

@Entity('quiz')
export class QuizEntity extends BaseEntity {
  @Column({ nullable: false })
  body: string;

  @Column({ type: 'boolean', default: false })
  published: boolean;

  @Column('text', { array: true, nullable: false })
  correctAnswers: string[];

  @ManyToOne(() => PairsEntity, (pair) => pair.id, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn()
  pair: PairsEntity;
}
