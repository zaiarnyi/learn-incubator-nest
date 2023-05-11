import { IsIP, IsNumber, IsString } from 'class-validator';
import { UserEntity } from '../../users/entities/user.entity';

export class DeviceDto {
  @IsIP()
  ip: string;

  @IsString()
  title: string;

  @IsNumber()
  user: UserEntity;

  @IsString()
  userAgent: string;
}
