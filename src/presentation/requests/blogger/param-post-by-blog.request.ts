import { IsNotEmpty, IsString } from 'class-validator';
import { ValidateBlogById } from '../../../infrastructure/validators/validateBlogById.validator';
import { Transform } from 'class-transformer';

export class ParamPostByBlogRequest {
  @IsString()
  @IsNotEmpty()
  @ValidateBlogById()
  @Transform(({ value }) => value && parseInt(value.trim()))
  blogId: number;

  @IsString()
  @IsNotEmpty()
  postId: string;
}
