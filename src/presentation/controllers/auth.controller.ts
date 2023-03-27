import { BadRequestException, Body, Controller, Get, HttpCode, Inject, Post, Res } from '@nestjs/common';
import { CheckEmail } from '../requests/auth/password-recovery.request';
import { NewPasswordRequest } from '../requests/auth/new-password.request';
import { LoginRequest } from '../requests/auth/login.request';
import { RegistrationConfirmationRequest } from '../requests/auth/registration-confirmation.request';
import { RegistrationRequest } from '../requests/auth/registration.request';
import { LoginResponse } from '../responses/auth/login.response';
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

@Controller('auth')
export class AuthController {
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
  ) {}
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

  @Post('login')
  async login(@Body() body: LoginRequest, @Res({ passthrough: true }) response: Response) {
    const httpOnly = this.configService.get<string>('HTTPS_ONLY_COOKIES') === 'true';
    const secure = this.configService.get<string>('SECURITY_COOKIE') === 'true';
    const { accessToken, refreshToken } = await this.loginService.execute(body);

    response.cookie('refreshToken', refreshToken, { httpOnly, secure });
    response.status(201).json({ accessToken });
  }

  @Post('refresh-token')
  async createRefreshToken(@Cookies('refreshToken') token: string) {}

  @Post('registration-confirmation')
  @HttpCode(204)
  async registrationConfirmation(@Body() body: RegistrationConfirmationRequest): Promise<void> {
    return this.confirmationService.execute(body.code);
  }

  @Post('registration')
  @HttpCode(204)
  async registration(@Body() body: RegistrationRequest): Promise<void> {
    const detectUser = await this.queryUserRepository.getUserByEmailOrLogin(body.login, body.email);
    if (detectUser) {
      throw new BadRequestException(
        JSON.stringify([{ message: 'A user already exists', field: 'email or login' }]),
        'test',
      );
    }
    return this.registrationService.execute(body);
  }

  @Post('registration-email-resending')
  @HttpCode(204)
  async registrationEmailResending(@Body() body: CheckEmail): Promise<void> {
    const detectUser = await this.queryUserRepository.getUserByEmail(body.email);
    if (!detectUser) {
      throw new BadRequestException(JSON.stringify([{ message: 'User not found', field: 'email' }]));
    }

    return this.resendingService.execute(body.email, detectUser._id.toString());
  }

  @Post('logout')
  @HttpCode(204)
  async logout(): Promise<any> {}

  @Get('me')
  async me(): Promise<any | MeResponse> {}
}
