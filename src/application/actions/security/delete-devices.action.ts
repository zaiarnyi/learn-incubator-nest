import { Inject, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { QuerySecurityRepository } from '../../../infrastructure/database/repositories/security/query-security.repository';
import { MainSecurityRepository } from '../../../infrastructure/database/repositories/security/main-security.repository';

@Injectable()
export class DeleteDevicesAction {
  private logger = new Logger(DeleteDevicesAction.name);
  constructor(
    @Inject(JwtService) private readonly jwtService: JwtService,
    @Inject(QuerySecurityRepository) private readonly queryRepository: QuerySecurityRepository,
    @Inject(MainSecurityRepository) private readonly mainRepository: MainSecurityRepository,
  ) {}

  public async execute(token: string) {
    try {
      const { deviceId, id } = await this.jwtService.verify(token);
      await this.mainRepository.deleteAllExcludeCurrent(deviceId, id).catch((e) => {
        this.logger.error(`Error when deleting all sessions except the current one. Error: ${JSON.stringify(e)}`);
      });
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}
