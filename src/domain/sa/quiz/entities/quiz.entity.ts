import { Column, Entity, ManyToMany } from 'typeorm';
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

  @ManyToMany(() => PairsEntity, (pair) => pair.id, { nullable: true, onDelete: 'SET NULL' })
  pair: PairsEntity;
}
