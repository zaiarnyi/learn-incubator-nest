import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  Inject,
  Logger,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { CheckEmail } from '../requests/auth/password-recovery.request';
import { NewPasswordRequest } from '../requests/auth/new-password.request';
import { RegistrationConfirmationRequest } from '../requests/auth/registration-confirmation.request';
import { RegistrationRequest } from '../requests/auth/registration.request';
import { MeResponse } from '../responses/auth/me.response';
import { UserQueryRepository } from '../../infrastructure/database/repositories/users/query.repository';
import { RegistrationActions } from '../../application/actions/auth/registration.actions';
import { ResendingEmailAction } from '../../application/actions/auth/resending-email.action';
import { RegistrationConfirmationAction } from '../../application/actions/auth/registration-confirmation.action';
import { PasswordRecoveryAction } from '../../application/actions/auth/password-recovery.action';
import { NewPasswordAction } from '../../application/actions/auth/new-password.action';
import { LoginAction } from '../../application/actions/auth/login.action';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { RefreshTokenAction } from '../../application/actions/auth/refresh-token.action';
import { Cookies } from '../../infrastructure/decorators/cookies.decorator';
import { LocalAuthGuard } from '../../domain/auth/guards/local-auth.guard';
import { JwtAuthGuard } from '../../domain/auth/guards/jwt-auth.guard';
import { plainToClass } from 'class-transformer';
import { MainSecurityRepository } from '../../infrastructure/database/repositories/security/main-security.repository';
import { DeviceDto } from '../../domain/security/dto/device.dto';
import { LoginRequest } from '../requests/auth/login.request';
import { SkipThrottle, Throttle } from '@nestjs/throttler';
import { JwtService } from '@nestjs/jwt';
import { InvalidUserTokensService } from '../../application/services/invalid-tokens/invalid-user-tokens.service';

@Throttle(5, 15)
@Controller('auth')
export class AuthController {
  private logger = new Logger(AuthController.name);
  httpOnly = true;
  secure = true;
  isDev = false;

  constructor(
    @Inject(UserQueryRepository) private readonly queryUserRepository: UserQueryRepository,
    @Inject(RegistrationActions) private readonly registrationService: RegistrationActions,
    @Inject(ResendingEmailAction) private readonly resendingService: ResendingEmailAction,
    @Inject(RegistrationConfirmationAction) private readonly confirmationService: RegistrationConfirmationAction,
    @Inject(PasswordRecoveryAction) private readonly recoveryService: PasswordRecoveryAction,
    @Inject(NewPasswordAction) private readonly newPasswordService: NewPasswordAction,
    @Inject(LoginAction) private readonly loginService: LoginAction,
    @Inject(ConfigService) private readonly configService: ConfigService,
    @Inject(RefreshTokenAction) private readonly refreshTokenService: RefreshTokenAction,
    @Inject(MainSecurityRepository) private readonly securityRepository: MainSecurityRepository,
    @Inject(InvalidUserTokensService) private readonly tokensRepository: InvalidUserTokensService,
    @Inject(JwtService) private readonly jwtService: JwtService,
  ) {
    this.httpOnly = this.configService.get<string>('HTTPS_ONLY_COOKIES') === 'true';
    this.secure = this.configService.get<string>('SECURITY_COOKIE') === 'true';
    this.isDev = this.configService.get<string>('NODE_ENV') === 'development';
  }
  @Post('password-recovery')
  @HttpCode(204)
  async passwordRecovery(@Body() body: CheckEmail): Promise<void> {
    return this.recoveryService.execute(body.email);
  }
  @Post('new-password')
  @HttpCode(204)
  async createNewPassword(@Body() body: NewPasswordRequest): Promise<void> {
    return this.newPasswordService.execute(body);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req: any, @Res({ passthrough: true }) response: Response, @Body() body: LoginRequest) {
    const { userId } = req.user;
    const devicePrepare = new DeviceDto();
    devicePrepare.ip = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || req.socket.remoteAddress || null;
    devicePrepare.userId = userId;
    devicePrepare.title = 'security Name';
    devicePrepare.userAgent = req.headers['user-agent'];

    const device = await this.securityRepository.insertDevice(devicePrepare).catch((e) => {
      this.logger.error(`Error when saving device information. Error: ${JSON.stringify(e)}`);
      return null;
    });
    const { accessToken, refreshToken } = await this.loginService.execute(body, device._id.toString());

    response.cookie('refreshToken', refreshToken, { httpOnly: this.httpOnly, secure: this.secure });
    response.status(200).json({ accessToken });
  }

  @Post('refresh-token')
  async createRefreshToken(@Cookies('refreshToken') token: string, @Res({ passthrough: true }) response: Response) {
    if (!token?.length) {
      throw new UnauthorizedException();
    }

    let deviceId;
    try {
      const jwt = await this.jwtService.verify(token);

      deviceId = jwt.deviceId;
    } catch (e) {
      throw new UnauthorizedException();
    }
    const checkToken = await this.tokensRepository.checkTokenFromUsers(token);
    if (checkToken) {
      throw new UnauthorizedException();
    }

    const { accessToken, refreshToken } = await this.refreshTokenService.execute(token);

    const findDevice = await this.securityRepository.getDevice(deviceId);
    await Promise.all([
      this.tokensRepository.saveToken(token),
      findDevice && this.securityRepository.updateDevice(findDevice),
    ]);
    response.cookie('refreshToken', refreshToken, { httpOnly: this.httpOnly, secure: this.secure });
    response.status(200).json({ accessToken });
  }

  @Post('registration-confirmation')
  @HttpCode(204)
  async registrationConfirmation(@Body() body: RegistrationConfirmationRequest) {
    await this.confirmationService.execute(body.code);
  }

  @Post('registration')
  async registration(@Body() body: RegistrationRequest, @Res() res: Response) {
    const detectUser = await this.queryUserRepository.getUserByEmailOrLogin(body.login, body.email);
    if (detectUser) {
      const filed = body.login === detectUser.login ? 'login' : 'email';
      throw new BadRequestException([{ message: 'A user already exists', field: filed }]);
    }
    const registration = await this.registrationService.execute(body);
    if (!this.isDev) {
      return res.sendStatus(204);
    }
    res.status(200).json(registration);
  }

  @Post('registration-email-resending')
  @HttpCode(204)
  async registrationEmailResending(@Body() body: CheckEmail): Promise<void> {
    const detectUser = await this.queryUserRepository.getUserByEmail(body.email);
    if (!detectUser || detectUser.isConfirm) {
      throw new BadRequestException([{ message: 'User not found', field: 'email' }]);
    }
    await this.resendingService.execute(body.email, detectUser._id.toString());
  }

  @Post('logout')
  async logout(@Res() response: Response, @Cookies('refreshToken') token?: string) {
    if (!token?.length) {
      throw new UnauthorizedException();
    }
    let userId;
    let deviceId;
    try {
      const jwt = await this.jwtService.verify(token);
      userId = jwt.id;
      deviceId = jwt.deviceId;
    } catch (e) {
      throw new UnauthorizedException();
    }
    const checkToken = await this.tokensRepository.checkTokenFromUsers(token);
    if (checkToken) {
      throw new UnauthorizedException();
    }
    await Promise.all([
      this.tokensRepository.saveToken(token),
      this.securityRepository.deleteDeviceForUser(deviceId, userId),
    ]);
    response.clearCookie('refreshToken').sendStatus(204);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@Req() req): Promise<MeResponse> {
    const user = await this.queryUserRepository.getUserById(req.user.userId);
    if (!user) {
      throw new UnauthorizedException();
    }
    return plainToClass(MeResponse, {
      ...user.toJSON(),
      userId: user._id.toString(),
    });
  }
}
