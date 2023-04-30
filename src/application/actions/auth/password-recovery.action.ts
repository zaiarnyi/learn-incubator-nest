import { Inject, Injectable, Logger } from '@nestjs/common';
import { UserQueryRepository } from '../../../infrastructure/database/repositories/users/query.repository';
import { EmailRegistrationService } from '../../services/email/email-registration.service';
import { generateCode } from '../../../utils/generateCode';
import { MainActivateCodeRepository } from '../../../infrastructure/database/repositories/activate-code/main-activate-code.repository';
import { ActivateCodeEnum } from '../../../domain/auth/entity/activate-code.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PasswordRecoveryAction {
  private logger = new Logger(PasswordRecoveryAction.name);
  constructor(
    @Inject(UserQueryRepository) private readonly userRepository: UserQueryRepository,
    @Inject(EmailRegistrationService) private readonly emailService: EmailRegistrationService,
    @Inject(MainActivateCodeRepository) private readonly activateRepository: MainActivateCodeRepository,
    @Inject(ConfigService) private readonly configService: ConfigService,
  ) {}

  public async execute(email: string) {
    const user = await this.userRepository.getUserByEmail(email);

    if (!user) return null;
    const code = generateCode(6);
    try {
      await Promise.all([
        this.emailService.recoveryPassword(email, code),
        this.activateRepository.deleteByUserId(user.id, ActivateCodeEnum.RECOVERY),
      ]);
      await this.activateRepository.saveRegActivation(code, user.id, ActivateCodeEnum.RECOVERY);
    } catch (e) {
      this.logger.error(JSON.stringify(e));
    }

    const isDev = this.configService.get<string>('NODE_ENV') === 'development';
    if (isDev) {
      console.log(code);
    }
  }
}
