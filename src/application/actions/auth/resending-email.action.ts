import { Inject, Injectable } from '@nestjs/common';
import { EmailRegistrationService } from '../../services/email/email-registration.service';
import { MainActivateCodeRepository } from '../../../infrastructure/database/repositories/activate-code/main-activate-code.repository';
import { generateCode } from '../../../utils/generateCode';
import { UserMainRepository } from '../../../infrastructure/database/repositories/users/main.repository';
import { ActivateCodeEnum } from '../../../infrastructure/database/entity/activate-code.entity';

@Injectable()
export class ResendingEmailAction {
  constructor(
    @Inject(EmailRegistrationService) private readonly emailService: EmailRegistrationService,
    @Inject(MainActivateCodeRepository)
    private readonly activationRepository: MainActivateCodeRepository,
    @Inject(UserMainRepository)
    private readonly mainUserRepository: UserMainRepository,
  ) {}

  public async execute(email: string, userId: string) {
    const code = generateCode(6);
    try {
      await this.emailService.registration(email, code);
      await this.activationRepository.saveRegActivation(code, userId, ActivateCodeEnum.REGISTRATION);
    } catch (e) {
      await this.mainUserRepository.changeStatusSendEmail(userId, false);
    }
  }
}
