import { Exclude, Expose } from 'class-transformer';
import { MetaResponse } from '../meta.response';
import { CreateBlogResponse } from './create-blog.response';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class GetAllBlogsResponse extends MetaResponse {
  @Expose()
  @ApiProperty({ type: CreateBlogResponse, isArray: true })
  items: CreateBlogResponse[];
}
