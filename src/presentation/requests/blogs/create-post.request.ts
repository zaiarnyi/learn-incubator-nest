import { IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';
import { Trim } from 'class-sanitizer';

export class CreatePostRequest {
  @MaxLength(15)
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value && value.trim())
  @Trim()
  name: string;

  @MaxLength(500)
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value && value.trim())
  @Trim()
  description: string;

  @Matches(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/)
  @MaxLength(100)
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value && value.trim())
  @Trim()
  websiteUrl: string;
}
