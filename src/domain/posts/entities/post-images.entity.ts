import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PostEntity } from './post.entity';

@Entity('post_images')
export class PostImagesEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => PostEntity, (post) => post.id)
  @JoinColumn()
  post: PostEntity;

  @Column({})
  path: string;

  @Column({ type: 'float' })
  fileSize: number;

  @Column({ type: 'float' })
  width: number;

  @Column({ type: 'float' })
  height: number;

  @CreateDateColumn()
  createdAt: Date;
}
