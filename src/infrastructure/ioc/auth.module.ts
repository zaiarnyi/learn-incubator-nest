import { Module } from '@nestjs/common';
import { AuthController } from '../../presentation/controllers/auth.controller';
import { UsersModule } from './users.module';
import { CreateUserAction } from '../../application/actions/users/create-user.action';
import { EmailModule } from './email.module';
import { RegistrationActions } from '../../application/actions/auth/registration.actions';
import { ActivateCodeModule } from './activate-code.module';
import { ResendingEmailAction } from '../../application/actions/auth/resending-email.action';
import { RegistrationConfirmationAction } from '../../application/actions/auth/registration-confirmation.action';
import { PasswordRecoveryAction } from '../../application/actions/auth/password-recovery.action';
import { NewPasswordAction } from '../../application/actions/auth/new-password.action';
import { LoginAction } from '../../application/actions/auth/login.action';
import { RefreshTokenAction } from '../../application/actions/auth/refresh-token.action';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from '../../domain/auth/strategies/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtConfigService } from '../configs/jwt/jwt.config';
import { JwtStrategy } from '../../domain/auth/strategies/jwt.stategy';
import { BasicStrategy } from '../../domain/auth/strategies/basic.strategy';
import { SecurityModule } from './security.module';
import { InvalidTokensModule } from './invalidTokens.module';

@Module({
  imports: [
    UsersModule,
    EmailModule,
    ActivateCodeModule,
    PassportModule,
    JwtModule.registerAsync({
      useClass: JwtConfigService,
    }),
    SecurityModule,
    InvalidTokensModule,
  ],
  controllers: [AuthController],
  providers: [
    CreateUserAction,
    RegistrationActions,
    ResendingEmailAction,
    RegistrationConfirmationAction,
    PasswordRecoveryAction,
    NewPasswordAction,
    LoginAction,
    RefreshTokenAction,
    LocalStrategy,
    JwtStrategy,
    BasicStrategy,
  ],
})
export class AuthModule {}
