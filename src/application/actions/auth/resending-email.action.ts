import { Inject, Injectable, Logger } from '@nestjs/common';
import { EmailRegistrationService } from '../../services/email/email-registration.service';
import { MainActivateCodeRepository } from '../../../infrastructure/database/repositories/activate-code/main-activate-code.repository';
import { generateCode } from '../../../utils/generateCode';
import { UserMainRepository } from '../../../infrastructure/database/repositories/users/main.repository';
import { ActivateCodeEnum } from '../../../domain/auth/entity/activate-code.entity';

@Injectable()
export class ResendingEmailAction {
  logger = new Logger(ResendingEmailAction.name);
  constructor(
    @Inject(EmailRegistrationService) private readonly emailService: EmailRegistrationService,
    @Inject(MainActivateCodeRepository)
    private readonly activationRepository: MainActivateCodeRepository,
    @Inject(UserMainRepository)
    private readonly mainUserRepository: UserMainRepository,
  ) {}

  public async execute(email: string, userId: number) {
    const code = generateCode(6);
    try {
      await Promise.all([
        this.emailService.registration(email, code).then((res) => {
          this.logger.warn(`${JSON.stringify(res)}`);
        }),
        this.activationRepository.saveRegActivation(code, userId, ActivateCodeEnum.REGISTRATION),
        this.mainUserRepository.changeStatusSendEmail(userId, true),
      ]);
    } catch (e) {
      await this.mainUserRepository.changeStatusSendEmail(userId, false);
    }
  }
}
