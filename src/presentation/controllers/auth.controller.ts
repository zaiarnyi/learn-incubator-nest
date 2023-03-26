import { BadRequestException, Body, Controller, Get, HttpCode, Inject, Post } from '@nestjs/common';
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

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(UserQueryRepository) private readonly queryUserRepository: UserQueryRepository,
    @Inject(RegistrationActions) private readonly registrationService: RegistrationActions,
    @Inject(ResendingEmailAction) private readonly resendingService: ResendingEmailAction,
    @Inject(RegistrationConfirmationAction) private readonly confirmationService: RegistrationConfirmationAction,
    @Inject(PasswordRecoveryAction) private readonly recoveryService: PasswordRecoveryAction,
    @Inject(NewPasswordAction) private readonly newPasswordService: NewPasswordAction,
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
  async login(@Body() body: LoginRequest): Promise<any | LoginResponse> {}

  @Post('refresh-token')
  async createRefreshToken(): Promise<any | LoginResponse> {}

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
