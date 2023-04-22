import { IsBoolean, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class UserBannedByBloggerDto {
  @IsString()
  @IsNotEmpty()
  blogId: string;

  @IsBoolean()
  @IsNotEmpty()
  isBanned: boolean;

  @IsNotEmpty()
  @MinLength(20)
  @Transform(({ value }) => value.trim())
  banReason: string;
}
