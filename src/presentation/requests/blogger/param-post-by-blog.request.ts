import { IsNotEmpty, IsString, Min } from 'class-validator';

export class ParamPostByBlogRequest {
  @IsString()
  @IsNotEmpty()
  blogId: string;

  @IsString()
  @IsNotEmpty()
  postId: string;
}
