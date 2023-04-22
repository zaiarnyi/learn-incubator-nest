import { IsNotEmpty, IsString } from 'class-validator';
import { ValidateBlogById } from '../../../../infrastructure/validators/validateBlogById.validator';

export class UpdateParamBannedByBlogRequest {
  @IsString()
  @IsNotEmpty()
  @ValidateBlogById()
  id: string;
}
