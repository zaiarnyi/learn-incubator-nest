import { Inject, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserQueryRepository } from '../../../infrastructure/database/repositories/users/query.repository';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RefreshTokenAction {
  private logger = new Logger(RefreshTokenAction.name);

  constructor(
    @Inject(UserQueryRepository) private readonly queryUserRepository: UserQueryRepository,
    @Inject(ConfigService) private readonly configService: ConfigService,
    @Inject(JwtService) private readonly jwtService: JwtService,
  ) {}

  public async execute(deviceId: string, userId: number): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const user = await this.queryUserRepository.getUserById(userId);
      if (!user) {
        throw new UnauthorizedException();
      }

      const expires_refresh = this.configService.get<string>('REFRESH_TOKEN_EXPIRE_TIME');
      const payload = { id: userId, deviceId };
      const accessToken = this.jwtService.sign(payload);
      const refreshToken = this.jwtService.sign(payload, { expiresIn: expires_refresh });

      return { accessToken, refreshToken };
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}
