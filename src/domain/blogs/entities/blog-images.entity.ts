import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BlogEntity } from './blog.entity';
import { BlogImagesTypeEnum } from '../enums/blog-images-type.enum';

@Entity('blog_images')
export class BlogImagesEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => BlogEntity, (blog) => blog.id)
  @JoinColumn()
  blog: BlogEntity;

  @Column({ enum: BlogImagesTypeEnum, type: 'enum', nullable: false, default: BlogImagesTypeEnum.MAIN })
  type: BlogImagesTypeEnum;

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
