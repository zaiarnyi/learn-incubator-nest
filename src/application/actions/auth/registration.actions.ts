import { Inject, Injectable } from '@nestjs/common';
import { CreateUserAction } from '../sa/users/create-user.action';
import { CreateUserDto } from '../../../domain/sa/users/dto/create-user.dto';
import { EmailRegistrationService } from '../../services/email/email-registration.service';
import { generateCode } from '../../../utils/generateCode';
import { MainActivateCodeRepository } from '../../../infrastructure/database/repositories/activate-code/main-activate-code.repository';
import { UserMainRepository } from '../../../infrastructure/database/repositories/users/main.repository';
import { ActivateCodeEnum } from '../../../domain/auth/entity/activate-code.entity';
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
    const user = await this.createUserService.execute(payload, false);
    const code = generateCode(6);

    try {
      // const isDev = this.configService.get<string>('NODE_ENV') === 'development';
      await Promise.all([
        this.activateRepository.saveRegActivation(code, user.id, ActivateCodeEnum.REGISTRATION),
        this.emailService.registration(payload.email, code),
      ]);

      // if (isDev) {
      //   return { code };
      // }
    } catch (e) {
      console.log(e, ' === error');
      await this.mainUserRepository.changeStatusSendEmail(user.id, false);
    }
  }
}
