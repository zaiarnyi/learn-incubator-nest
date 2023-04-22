import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class UpdateBannedByBlogRequest {
  @IsBoolean()
  @IsNotEmpty()
  isBanned: boolean;
}
