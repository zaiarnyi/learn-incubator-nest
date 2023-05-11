import { BadRequestException, Inject, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from '../../../domain/auth/dto/login.dto';
import { validateOrReject } from 'class-validator';
import { UserQueryRepository } from '../../../infrastructure/database/repositories/users/query.repository';
import * as bcrypt from 'bcryptjs';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { MainSecurityRepository } from '../../../infrastructure/database/repositories/security/main-security.repository';
import { UserRoles } from '../../../domain/auth/enums/roles.enum';
import { UserEntity } from '../../../domain/users/entities/user.entity';

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

  private generateTokens(id: number, deviceId: string) {
    const expires_refresh = this.configService.get<string>('REFRESH_TOKEN_EXPIRE_TIME');
    const payload = { id, deviceId };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, { expiresIn: expires_refresh });
    return { accessToken, refreshToken };
  }

  public async execute(
    payload: LoginDto,
    deviceId: string,
    user: UserEntity,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    await this.validate(payload);
    const checkHashPassword = await bcrypt.compare(payload.password, user.passwordHash);
    if (!checkHashPassword) {
      await this.securityRepository.deleteDeviceForUser(+deviceId, user.id);
      throw new UnauthorizedException();
    }
    return this.generateTokens(user.id, deviceId);
  }
}
