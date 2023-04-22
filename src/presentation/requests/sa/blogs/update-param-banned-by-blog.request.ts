import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateParamBannedByBlogRequest {
  @IsString()
  @IsNotEmpty()
  id: string;
}
