import { IsNotEmpty, IsString } from 'class-validator';

export class ParamPostByBlogRequest {
  @IsString()
  @IsNotEmpty()
  blogId: string;

  @IsString()
  @IsNotEmpty()
  postId: string;
}
