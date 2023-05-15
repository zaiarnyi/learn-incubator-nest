import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('quiz')
export class QuizEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  body: string;

  @Column({ type: 'boolean', default: false })
  published: boolean;

  @Column({ type: 'jsonb', nullable: false })
  correctAnswers: Array<string | number>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
