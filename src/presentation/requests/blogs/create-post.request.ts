import { IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreatePostRequest {
  @MaxLength(15)
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value && value.trim())
  name: string;

  @MaxLength(500)
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value && value.trim())
  description: string;

  @Matches(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/)
  @MaxLength(100)
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value && value.trim())
  websiteUrl: string;
}
