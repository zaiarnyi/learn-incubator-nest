import { IsNotEmpty, IsString } from 'class-validator';
import { Trim } from 'class-sanitizer';
import { ValidateBlogById } from '../../../infrastructure/validators/validateBlogById.validator';

export class CheckBlogIdRequest {
  @IsString()
  @IsNotEmpty()
  @Trim()
  @ValidateBlogById()
  id: string;
}
