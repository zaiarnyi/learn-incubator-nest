import { Exclude, Expose, Type } from 'class-transformer';
import { MetaResponse } from '../../meta.response';
import { ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class BanInfo {
  @Expose()
  @ApiProperty({ type: Boolean, default: false, example: true })
  isBanned: boolean;

  @Expose()
  @ApiProperty({ type: Date, nullable: false, example: new Date() })
  banDate: Date;

  @Expose()
  @ApiProperty({ type: String, nullable: false, example: 'reason text' })
  banReason: string;
}

@Exclude()
export class GetUser {
  @Expose()
  @ApiProperty({ type: String, nullable: false, example: 42 })
  id: string;

  @Expose()
  @ApiProperty({ type: String, nullable: false, example: 'login' })
  login: string;

  @Expose()
  @ApiProperty({ type: String, nullable: false, example: 'x@x.com' })
  email: string;

  @Expose()
  @ApiProperty({ type: Date, nullable: false, example: new Date() })
  createdAt: Date;

  @Type(() => BanInfo)
  @ValidateNested()
  @Expose()
  @ApiProperty({ type: BanInfo })
  banInfo?: BanInfo;
}

@Exclude()
export class GetUsersResponse extends MetaResponse {
  @Type(() => GetUser)
  @ValidateNested()
  @Expose()
  @ApiProperty({ type: GetUser, isArray: true })
  items: GetUser[];
}
