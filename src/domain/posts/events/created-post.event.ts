import { BlogEntity } from '../../blogs/entities/blog.entity';

export class CreatedPostEvent {
  blog: BlogEntity;

  constructor(blogName: BlogEntity) {
    this.blog = blogName;
  }
}
