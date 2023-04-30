import { IsIP, IsNumber, IsString } from 'class-validator';

export class DeviceDto {
  @IsIP()
  ip: string | null;

  @IsString()
  title: string;

  @IsNumber()
  user: number;

  @IsString()
  userAgent: string;
}
