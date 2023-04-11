import { Inject, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { QuerySecurityRepository } from '../../../infrastructure/database/repositories/security/query-security.repository';
import { MainSecurityRepository } from '../../../infrastructure/database/repositories/security/main-security.repository';

@Injectable()
export class DeleteDevicesAction {
  private logger = new Logger(DeleteDevicesAction.name);
  constructor(
    @Inject(QuerySecurityRepository) private readonly queryRepository: QuerySecurityRepository,
    @Inject(MainSecurityRepository) private readonly mainRepository: MainSecurityRepository,
  ) {}

  public async execute(deviceId: string, userId: string) {
    try {
      await this.mainRepository.deleteAllExcludeCurrent(deviceId, userId).catch((e) => {
        this.logger.error(`Error when deleting all sessions except the current one. Error: ${JSON.stringify(e)}`);
      });
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}
