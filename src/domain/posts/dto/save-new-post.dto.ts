import { CreatePostDto } from './create-post.dto';
import { IsString } from 'class-validator';

export class SaveNewPostDto extends CreatePostDto {
  @IsString()
  blogName: string;
}
