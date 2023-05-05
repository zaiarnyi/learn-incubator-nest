import { IsNotEmpty, IsNumber } from 'class-validator';
import { ValidateBlogById } from '../../../infrastructure/validators/validateBlogById.validator';
import { Transform } from 'class-transformer';

export class ParamPostByBlogRequest {
  @IsNumber()
  @IsNotEmpty()
  @ValidateBlogById()
  @Transform(({ value }) => value && parseInt(value.trim()))
  blogId: number;

  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => value && parseInt(value.trim()))
  postId: number;
}
