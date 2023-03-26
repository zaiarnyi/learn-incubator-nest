import { Inject, Injectable } from '@nestjs/common';
import { CreateUserAction } from '../users/create-user.action';
import { CreateUserDto } from '../../../domain/users/dto/create-user.dto';
import { EmailRegistrationAction } from '../email/email-registration.action';
import { generateCode } from '../../../utils/generateCode';
import { MainActivateCodeRepository } from '../../../infrastructure/database/repositories/activate-code/main-activate-code.repository';
import { UserMainRepository } from '../../../infrastructure/database/repositories/users/main.repository';
import { ActivateCodeEnum } from '../../../infrastructure/database/entity/activate-code.entity';

@Injectable()
export class RegistrationActions {
  constructor(
    @Inject(CreateUserAction) private readonly createUserService: CreateUserAction,
    @Inject(EmailRegistrationAction) private readonly emailService: EmailRegistrationAction,
    @Inject(MainActivateCodeRepository) private readonly activateRepository: MainActivateCodeRepository,
    @Inject(UserMainRepository)
    private readonly mainUserRepository: UserMainRepository,
  ) {}

  public async execute(payload: CreateUserDto) {
    const users = await this.createUserService.execute(payload, false);
    const code = generateCode(6);

    try {
      await this.emailService.registration(payload.email, code);
      await this.activateRepository.saveRegActivation(code, users._id.toString(), ActivateCodeEnum.REGISTRATION);
    } catch (e) {
      await this.mainUserRepository.changeStatusSendEmail(users._id.toString(), false);
    }
  }
}
