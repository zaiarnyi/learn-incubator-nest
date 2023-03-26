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

@Module({
  imports: [UsersModule, EmailModule, ActivateCodeModule],
  controllers: [AuthController],
  providers: [
    CreateUserAction,
    RegistrationActions,
    ResendingEmailAction,
    RegistrationConfirmationAction,
    PasswordRecoveryAction,
    NewPasswordAction,
  ],
})
export class AuthModule {}
