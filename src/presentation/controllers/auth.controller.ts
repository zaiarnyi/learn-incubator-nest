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
import { Throttle } from '@nestjs/throttler';
import { JwtService } from '@nestjs/jwt';
import { InvalidUserTokensService } from '../../application/services/invalid-tokens/invalid-user-tokens.service';
import { v4 as uuidv4 } from 'uuid';
import { QueryUserBannedRepository } from '../../infrastructure/database/repositories/sa/users/query-user-banned.repository';

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
    @Inject(QueryUserBannedRepository) private readonly userBannedRepository: QueryUserBannedRepository,
  ) {
    this.httpOnly = this.configService.get<string>('HTTPS_ONLY_COOKIES') === 'true';
    this.secure = this.configService.get<string>('SECURITY_COOKIE') === 'true';
    this.isDev = this.configService.get<string>('NODE_ENV') === 'development';
  }
  @Post('password-recovery') // TODO Done
  @HttpCode(204)
  async passwordRecovery(@Body() body: CheckEmail): Promise<any> {
    return this.recoveryService.execute(body.email);
  }
  @Post('new-password') // TODO Done
  @HttpCode(204)
  async createNewPassword(@Body() body: NewPasswordRequest): Promise<void> {
    return this.newPasswordService.execute(body);
  }
  @Throttle(5, 10)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req: any, @Res({ passthrough: true }) response: Response, @Body() body: LoginRequest) {
    const devicePrepare = new DeviceDto();
    devicePrepare.ip = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || req.socket.remoteAddress || null;
    devicePrepare.user = req.user.id;
    devicePrepare.title = 'security Name';
    devicePrepare.userAgent = req.headers['user-agent'];

    const device = await this.securityRepository.insertDevice(devicePrepare);
    const { accessToken, refreshToken } = await this.loginService.execute(body, device.id.toString(), req.user);

    response.cookie('refreshToken', refreshToken, { httpOnly: this.httpOnly, secure: this.secure });
    response.status(200).json({ accessToken });
  }

  @Post('refresh-token')
  async createRefreshToken(@Cookies('refreshToken') token: string, @Res({ passthrough: true }) response: Response) {
    if (!token?.length) {
      throw new UnauthorizedException();
    }

    let deviceId;
    let userId;
    try {
      const jwt = await this.jwtService.verify(token);

      deviceId = jwt.deviceId.toString();
      userId = jwt.id;
    } catch (e) {
      throw new UnauthorizedException();
    }

    const checkToken = await this.tokensRepository.checkTokenFromUsers(token);
    if (checkToken) {
      throw new UnauthorizedException();
    }

    const { accessToken, refreshToken } = await this.refreshTokenService.execute(deviceId, userId);

    const findDevice = await this.securityRepository.getDevice(+deviceId);
    await Promise.all([
      this.tokensRepository.saveToken(token, userId),
      findDevice && this.securityRepository.updateDevice(findDevice),
    ]);
    response.cookie('refreshToken', refreshToken, { httpOnly: this.httpOnly, secure: this.secure });
    response.status(200).json({ accessToken });
  }

  @Throttle(5, 10) //TODO Done
  @Post('registration-confirmation')
  @HttpCode(204)
  async registrationConfirmation(@Body() body: RegistrationConfirmationRequest) {
    await this.confirmationService.execute(body.code);
  }

  @Throttle(5, 10) //TODO Done
  @Post('registration')
  async registration(@Body() body: RegistrationRequest, @Res() res: Response) {
    const detectUser = await this.queryUserRepository.getUserByEmailOrLogin(body.login, body.email);
    if (detectUser) {
      const filed = body.login === detectUser.login ? 'login' : 'email';
      throw new BadRequestException([{ message: 'A user already exists', field: filed }]);
    }
    const registration = await this.registrationService.execute(body);

    if (!this.isDev) {
      res.sendStatus(204);
    } else {
      res.status(200).json(registration);
    }
  }
  @Throttle(5, 10) //TODO Done
  @Post('registration-email-resending')
  @HttpCode(204)
  async registrationEmailResending(@Body() body: CheckEmail): Promise<void> {
    const detectUser = await this.queryUserRepository.getUserByEmail(body.email);

    if (!detectUser || detectUser.is_confirm) {
      throw new BadRequestException([{ message: 'User not found', field: 'email' }]);
    }
    await this.resendingService.execute(body.email, detectUser.id);
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
      this.tokensRepository.saveToken(token, userId),
      this.securityRepository.deleteDeviceForUser(deviceId, userId),
    ]);
    response.clearCookie('refreshToken').sendStatus(204);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@Req() req): Promise<MeResponse> {
    return plainToClass(MeResponse, {
      ...req.user,
      userId: req.user.id.toString(),
    });
  }
}
