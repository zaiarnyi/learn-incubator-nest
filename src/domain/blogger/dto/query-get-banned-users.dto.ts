import { GetPostByBlogIdDto } from '../../blogs/dto/getPostByBlogId.dto';
import { IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class QueryGetBannedUsersDto extends GetPostByBlogIdDto {
  @IsString()
  @IsOptional()
  @Transform(({ value }) => value && String(value).trim())
  searchLoginTerm = '';
}
