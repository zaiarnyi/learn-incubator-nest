import { UserBannedRequest } from '../sa/users/user-banned.request';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';

export class UserBannedByBlogRequest extends UserBannedRequest {
  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => value && parseInt(value.trim()))
  blogId: number;
}
