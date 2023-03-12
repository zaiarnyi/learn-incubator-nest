import { Exclude, Expose } from 'class-transformer';
import { MetaResponse } from '../meta.response';
import { CreateBlogResponse } from './create-blog.response';

@Exclude()
export class GetAllBlogsResponse extends MetaResponse {
  @Expose()
  items: CreateBlogResponse[];
}
