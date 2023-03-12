import { IsString, Matches, MaxLength } from 'class-validator';

export class CreatePostRequest {
  @MaxLength(15)
  @IsString()
  name: string;

  @MaxLength(500)
  @IsString()
  description: string;

  @Matches(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/)
  @MaxLength(100)
  @IsString()
  websiteUrl: string;
}
