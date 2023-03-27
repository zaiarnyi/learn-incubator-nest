import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class RefreshTokenAction {
  logger = new Logger(RefreshTokenAction.name);

  constructor() {}
}
