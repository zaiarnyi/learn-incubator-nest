import { Exclude, Expose, Type } from 'class-transformer';
import { MetaResponse } from '../../meta.response';
import { ValidateNested } from 'class-validator';

@Exclude()
export class BanInfo {
  @Expose()
  isBanned: boolean;

  @Expose()
  banDate: Date;

  @Expose()
  banReason: string;
}

@Exclude()
export class GetUser {
  @Expose()
  id: string;

  @Expose()
  login: string;

  @Expose()
  email: string;

  @Expose()
  createdAt: Date;

  @Type(() => BanInfo)
  @ValidateNested()
  @Expose()
  banInfo?: BanInfo;
}

@Exclude()
export class GetUsersResponse extends MetaResponse {
  @Type(() => GetUser)
  @ValidateNested()
  @Expose()
  items: GetUser[];
}
