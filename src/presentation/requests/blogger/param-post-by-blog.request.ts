import { IsNotEmpty, IsString, Min } from 'class-validator';

export class ParamPostByBlogRequest {
  @IsString()
  @IsNotEmpty()
  @Min(5)
  blogId: string;

  @IsString()
  @IsNotEmpty()
  @Min(5)
  postId: string;
}
