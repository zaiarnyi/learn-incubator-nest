import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { GetDevicesResponse } from '../../../presentation/responses/security/get-devices.response';
import { JwtService } from '@nestjs/jwt';
import { QuerySecurityRepository } from '../../../infrastructure/database/repositories/security/query-security.repository';

@Injectable()
export class GetDevicesAction {
  constructor(
    @Inject(JwtService) private readonly jwtService: JwtService,
    @Inject(QuerySecurityRepository) private readonly queryRepository: QuerySecurityRepository,
  ) {}
  public async execute(userId: string): Promise<GetDevicesResponse[]> {
    const devices = await this.queryRepository.getDevicesByUserId(userId);
    return devices.map((item) =>
      plainToClass(GetDevicesResponse, { ...item.toObject(), deviceId: item._id.toString() }),
    );
  }
}
