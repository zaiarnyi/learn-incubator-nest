import { Inject, Injectable, Logger } from '@nestjs/common';
import { UserQueryRepository } from '../../../infrastructure/database/repositories/users/query.repository';
import { EmailRegistrationAction } from '../email/email-registration.action';
import { generateCode } from '../../../utils/generateCode';
import { MainActivateCodeRepository } from '../../../infrastructure/database/repositories/activate-code/main-activate-code.repository';
import { ActivateCodeEnum } from '../../../infrastructure/database/entity/activate-code.entity';

@Injectable()
export class PasswordRecoveryAction {
  private logger = new Logger(PasswordRecoveryAction.name);
  constructor(
    @Inject(UserQueryRepository) private readonly userRepository: UserQueryRepository,
    @Inject(EmailRegistrationAction) private readonly emailService: EmailRegistrationAction,
    @Inject(MainActivateCodeRepository) private readonly activateRepository: MainActivateCodeRepository,
  ) {}

  public async execute(email: string) {
    const user = await this.userRepository.getUserByEmail(email);

    if (!user) return null;
    const code = generateCode(6);
    try {
      await Promise.all([
        this.emailService.recoveryPassword(email, code),
        this.activateRepository.deleteByUserId(user._id.toString(), ActivateCodeEnum.RECOVERY),
      ]);
      await this.activateRepository.saveRegActivation(code, user._id.toString(), ActivateCodeEnum.RECOVERY);
    } catch (e) {
      this.logger.error(JSON.stringify(e));
    }
  }
}
