import { IsInt, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Trim } from 'class-sanitizer';
import { ValidateBlogById } from '../../../infrastructure/validators/validateBlogById.validator';
import { Transform } from 'class-transformer';

export class CheckBlogIdRequest {
  @IsNumber()
  @IsNotEmpty()
  @Trim()
  @ValidateBlogById()
  @Transform(({ value }) => value && parseInt(value))
  id: number;
}
