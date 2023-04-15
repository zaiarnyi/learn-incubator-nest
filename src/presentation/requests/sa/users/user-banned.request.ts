import { IsBoolean, IsNotEmpty, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class UserBannedRequest {
  @IsBoolean()
  @IsNotEmpty()
  isBanned: boolean;

  @IsNotEmpty()
  @MinLength(20)
  @Transform(({ value }) => value.trim())
  banReason: string;
}
