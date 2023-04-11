import { BadRequestException, Inject, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from '../../../domain/auth/dto/login.dto';
import { validateOrReject } from 'class-validator';
import { UserQueryRepository } from '../../../infrastructure/database/repositories/users/query.repository';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { MainSecurityRepository } from '../../../infrastructure/database/repositories/security/main-security.repository';

@Injectable()
export class LoginAction {
  private logger = new Logger(LoginAction.name);
  constructor(
    @Inject(UserQueryRepository) private readonly queryUserRepository: UserQueryRepository,
    @Inject(ConfigService) private readonly configService: ConfigService,
    @Inject(JwtService) private readonly jwtService: JwtService,
    @Inject(MainSecurityRepository) private readonly securityRepository: MainSecurityRepository,
  ) {}
  private async validate(payload: LoginDto) {
    try {
      await validateOrReject(payload);
    } catch (e) {
      throw new BadRequestException([{ field: 'email or login or password', message: 'Incorrect value' }]);
    }
  }

  private generateTokens(id: string, deviceId = '') {
    const expires_refresh = this.configService.get<string>('REFRESH_TOKEN_EXPIRE_TIME');
    const accessToken = this.jwtService.sign({ id, deviceId });
    const refreshToken = this.jwtService.sign({ id, deviceId }, { expiresIn: expires_refresh });
    return { accessToken, refreshToken, id };
  }

  public async execute(
    payload: LoginDto,
    deviceId: string,
    userId: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    await this.validate(payload);
    const user = await this.queryUserRepository
      .getUserByEmailOrLogin(payload.loginOrEmail, payload.loginOrEmail)
      .catch(() => {
        this.logger.error(`Error when getting a user - ${payload.loginOrEmail}`);
      });
    if (!user) {
      await this.securityRepository.deleteDeviceForUser(deviceId, userId);
      throw new UnauthorizedException();
    }

    const checkHashPassword = await bcrypt.compare(payload.password, user.passwordHash);

    if (!checkHashPassword) {
      await this.securityRepository.deleteDeviceForUser(deviceId, userId);
      throw new UnauthorizedException();
    }

    return this.generateTokens(user._id.toString(), deviceId);
  }
}
