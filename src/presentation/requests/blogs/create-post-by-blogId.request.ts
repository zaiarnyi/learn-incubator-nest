import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { Trim } from 'class-sanitizer';
import { Transform } from 'class-transformer';

export class CreatePostByBlogIdRequest {
  @IsString()
  @MaxLength(30)
  @Trim()
  @IsNotEmpty()
  @Transform(({ value }) => value && value.trim())
  title: string;

  @IsString()
  @MaxLength(100)
  @Trim()
  @IsNotEmpty()
  @Transform(({ value }) => value && value.trim())
  shortDescription: string;

  @IsString()
  @MaxLength(1000)
  @Trim()
  @IsNotEmpty()
  @Transform(({ value }) => value && value.trim())
  content: string;
}
