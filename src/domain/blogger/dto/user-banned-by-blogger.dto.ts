import { IsBoolean, IsNotEmpty, IsNumber, IsString, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class UserBannedByBloggerDto {
  @IsNumber()
  @IsNotEmpty()
  blogId: number;

  @IsBoolean()
  @IsNotEmpty()
  isBanned: boolean;

  @IsNotEmpty()
  @MinLength(20)
  @Transform(({ value }) => value.trim())
  banReason: string;
}
