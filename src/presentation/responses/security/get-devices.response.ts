import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class GetDevicesResponse {
  @Expose()
  ip: string;

  @Expose()
  title: string;

  @Expose()
  lastActiveDate: string;

  @Expose()
  deviceId: string;
}
