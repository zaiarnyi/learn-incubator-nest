import { Inject, Injectable } from '@nestjs/common';
import { CreateUserAction } from '../sa/users/create-user.action';
import { CreateUserDto } from '../../../domain/sa/users/dto/create-user.dto';
import { EmailRegistrationService } from '../../services/email/email-registration.service';
import { generateCode } from '../../../utils/generateCode';
import { MainActivateCodeRepository } from '../../../infrastructure/database/repositories/activate-code/main-activate-code.repository';
import { UserMainRepository } from '../../../infrastructure/database/repositories/users/main.repository';
import { ActivateCodeEnum } from '../../../infrastructure/database/entity/activate-code.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RegistrationActions {
  constructor(
    @Inject(CreateUserAction) private readonly createUserService: CreateUserAction,
    @Inject(EmailRegistrationService) private readonly emailService: EmailRegistrationService,
    @Inject(MainActivateCodeRepository) private readonly activateRepository: MainActivateCodeRepository,
    @Inject(UserMainRepository)
    private readonly mainUserRepository: UserMainRepository,
    @Inject(ConfigService) private readonly configService: ConfigService,
  ) {}

  public async execute(payload: CreateUserDto) {
    const users = await this.createUserService.execute(payload, false);
    const code = generateCode(6);

    try {
      const isDev = this.configService.get<string>('NODE_ENV') === 'development';
      await Promise.all([
        this.activateRepository.saveRegActivation(code, users._id.toString(), ActivateCodeEnum.REGISTRATION),
        !isDev && this.emailService.registration(payload.email, code),
      ]);

      if (isDev) {
        return { code };
      }
    } catch (e) {
      await this.mainUserRepository.changeStatusSendEmail(users._id.toString(), false);
    }
  }
}
