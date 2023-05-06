import { IsNotEmpty, IsNumber } from 'class-validator';
import { ValidateBlogById } from '../../../infrastructure/validators/validateBlogById.validator';

export class ParamPostByBlogRequest {
  @IsNumber()
  @IsNotEmpty()
  @ValidateBlogById()
  blogId: number;

  @IsNumber()
  @IsNotEmpty()
  postId: number;
}
