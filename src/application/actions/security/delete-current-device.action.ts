import {
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { QuerySecurityRepository } from '../../../infrastructure/database/repositories/security/query-security.repository';
import { MainSecurityRepository } from '../../../infrastructure/database/repositories/security/main-security.repository';

@Injectable()
export class DeleteCurrentDeviceAction {
  private logger = new Logger(DeleteCurrentDeviceAction.name);

  constructor(
    @Inject(JwtService) private readonly jwtService: JwtService,
    @Inject(QuerySecurityRepository) private readonly queryRepository: QuerySecurityRepository,
    @Inject(MainSecurityRepository) private readonly mainRepository: MainSecurityRepository,
  ) {}

  public async execute(token: string, deviceId: string): Promise<void> {
    const device = await this.queryRepository.getDeviceById(deviceId);

    if (!device) {
      throw new NotFoundException();
    }
    let user;
    try {
      user = await this.jwtService.verify(token);
    } catch (e) {
      throw new UnauthorizedException();
    }
    if (device.userId !== user.id) {
      throw new ForbiddenException();
    }
    await this.mainRepository.deleteCurrent(deviceId).catch(() => {
      this.logger.error(`Error when deleting the current session. DeviceId: ${deviceId}`);
    });
  }
}
