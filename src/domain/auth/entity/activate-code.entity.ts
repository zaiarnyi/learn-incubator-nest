import { UserEntity } from '../../users/entities/user.entity';
import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity('activate_emails_code')
export class ActivateEmailsCodeEntity {
  @PrimaryColumn()
  id: number;

  @Column()
  code: string;

  @Column({ type: Date })
  expireAt: Date;

  @OneToOne(() => UserEntity, (user) => user.id, { onDelete: 'CASCADE' })
  user: UserEntity;

  @Column()
  type: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
