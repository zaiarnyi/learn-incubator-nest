import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class DeviceService {
  logger = new Logger(DeviceService.name);
  constructor() {}
}
