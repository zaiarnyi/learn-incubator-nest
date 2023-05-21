import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../../../infrastructure/database/base.entity';

@Entity('quiz')
export class QuizEntity extends BaseEntity {
  @Column({ nullable: false })
  body: string;

  @Column({ type: 'boolean', default: false })
  published: boolean;

  @Column('text', { array: true, nullable: false })
  correctAnswers: string[];
}
