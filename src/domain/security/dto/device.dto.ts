import { IsIP, IsString, IsUUID } from 'class-validator';

export class DeviceDto {
  @IsIP()
  ip: string | null;

  @IsString()
  title: string;

  @IsString()
  userId: string;
}
