import { IsMongoId, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';
import { Trim } from 'class-sanitizer';
import { ValidateBlogById } from '../../../infrastructure/validators/validateBlogById.validator';

export class CreatePostRequest {
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

  @IsString()
  @IsMongoId()
  @Trim()
  @IsNotEmpty()
  @Transform(({ value }) => value && value.trim())
  @ValidateBlogById()
  blogId: string;
}
