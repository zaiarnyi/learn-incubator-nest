import { GetBlogsRequest } from '../blogs/get-blogs.request';
import { IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class GetBannedUserByBloggerRequest extends GetBlogsRequest {
  @IsString()
  @IsOptional()
  @Transform(({ value }) => value && String(value).trim())
  searchLoginTerm = '';
}
