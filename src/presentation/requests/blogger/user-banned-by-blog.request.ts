import { UserBannedRequest } from '../sa/users/user-banned.request';
import { IsNotEmpty, IsString } from 'class-validator';

export class UserBannedByBlogRequest extends UserBannedRequest {
  @IsString()
  @IsNotEmpty()
  blogId: string;
}
