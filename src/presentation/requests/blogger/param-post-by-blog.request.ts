import { IsNotEmpty, IsString } from 'class-validator';
import { ValidateBlogById } from '../../../infrastructure/validators/validateBlogById.validator';

export class ParamPostByBlogRequest {
  @IsString()
  @IsNotEmpty()
  @ValidateBlogById()
  blogId: string;

  @IsString()
  @IsNotEmpty()
  postId: string;
}
