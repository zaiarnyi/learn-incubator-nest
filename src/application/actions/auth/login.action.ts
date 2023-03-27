import { BadRequestException, Inject, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from '../../../domain/auth/dto/login.dto';
import { validateOrReject } from 'class-validator';
import { UserQueryRepository } from '../../../infrastructure/database/repositories/users/query.repository';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LoginAction {
  private logger = new Logger(LoginAction.name);
  constructor(
    @Inject(UserQueryRepository) private readonly queryUserRepository: UserQueryRepository,
    @Inject(ConfigService) private readonly configService: ConfigService,
  ) {}
  private async validate(payload: LoginDto) {
    try {
      await validateOrReject(payload);
    } catch (e) {
      throw new BadRequestException(
        JSON.stringify([{ field: 'email or login or password', message: 'Incorrect value' }]),
      );
    }
  }

  private generateTokens(id: string, device = '') {
    const secret = this.configService.get<string>('JWT_SECRET');
    const expires_access = this.configService.get<string>('ACCESS_TOKEN_EXPIRE_TIME');
    const expires_refresh = this.configService.get<string>('REFRESH_TOKEN_EXPIRE_TIME');
    let deviceId = device;
    if (!deviceId) {
      deviceId = uuidv4();
    }
    const accessToken = jwt.sign({ id, deviceId }, secret, { expiresIn: expires_access });
    const refreshToken = jwt.sign({ id, deviceId }, secret, { expiresIn: expires_refresh });
    return { accessToken, refreshToken };
  }

  public async execute(payload: LoginDto): Promise<{ accessToken: string; refreshToken: string }> {
    await this.validate(payload);
    const user = await this.queryUserRepository
      .getUserByEmailOrLogin(payload.loginOrEmail, payload.loginOrEmail)
      .catch(() => {
        this.logger.error(`Error when getting a user - ${payload.loginOrEmail}`);
      });
    if (!user) {
      throw new UnauthorizedException(
        JSON.stringify([{ message: 'If the password or login is wrong', field: 'password or login' }]),
      );
    }

    const checkHashPassword = await bcrypt.compare(payload.password, user.passwordHash);

    if (!checkHashPassword) {
      throw new UnauthorizedException(
        JSON.stringify([{ message: 'If the password or login is wrong', field: 'password or login' }]),
      );
    }

    return this.generateTokens(user._id.toString());
  }
}
