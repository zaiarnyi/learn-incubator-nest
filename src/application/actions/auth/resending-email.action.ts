import { Inject, Injectable, Logger } from '@nestjs/common';
import { EmailRegistrationService } from '../../services/email/email-registration.service';
import { MainActivateCodeRepository } from '../../../infrastructure/database/repositories/activate-code/main-activate-code.repository';
import { generateCode } from '../../../utils/generateCode';
import { UserMainRepository } from '../../../infrastructure/database/repositories/users/main.repository';
import { ActivateCodeEnum } from '../../../domain/auth/enums/activate-code.enum';
import { UserEntity } from '../../../domain/users/entities/user.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ResendingEmailAction {
  logger = new Logger(ResendingEmailAction.name);
  constructor(
    @Inject(EmailRegistrationService) private readonly emailService: EmailRegistrationService,
    @Inject(MainActivateCodeRepository)
    private readonly activationRepository: MainActivateCodeRepository,
    @Inject(UserMainRepository)
    private readonly mainUserRepository: UserMainRepository,
    @Inject(ConfigService) private readonly configService: ConfigService,
  ) {}

  public async execute(email: string, user: UserEntity) {
    const code = generateCode(6);
    const isDev = this.configService.get<string>('NODE_ENV') === 'development';
    try {
      await Promise.all([
        !isDev && this.emailService.registration(email, code),
        this.activationRepository.saveRegActivation(code, user, ActivateCodeEnum.REGISTRATION),
        this.mainUserRepository.changeStatusSendEmail(user.id, true),
      ]);
    } catch (e) {
      await this.mainUserRepository.changeStatusSendEmail(user.id, false);
    }
  }
}
