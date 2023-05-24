import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity } from '../../../infrastructure/database/base.entity';
import { UserEntity } from '../../users/entities/user.entity';

@Entity('pair_results')
export class PairResultsEntity extends BaseEntity {
  @OneToOne(() => UserEntity, (user) => user.id, { nullable: false })
  @JoinColumn()
  user: UserEntity;

  @Column({ nullable: false, default: 0 })
  winCount: number;

  @Column({ nullable: false, default: 0 })
  drawCount: number;

  @Column({ nullable: false, default: 0 })
  lossesCount: number;

  @Column({ nullable: false, default: 0 })
  sumScore: number;
}
