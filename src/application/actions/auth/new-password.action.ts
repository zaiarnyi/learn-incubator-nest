import { BadRequestException, Inject, Injectable, Logger } from '@nestjs/common';
import { NewPasswordDto } from '../../../domain/auth/dto/new-password.dto';
import { MainActivateCodeRepository } from '../../../infrastructure/database/repositories/activate-code/main-activate-code.repository';
import * as bcrypt from 'bcryptjs';
import { UserMainRepository } from '../../../infrastructure/database/repositories/users/main.repository';
import { ActivateCodeEnum } from '../../../domain/auth/enums/activate-code.enum';

@Injectable()
export class NewPasswordAction {
  private logger = new Logger(NewPasswordAction.name);
  constructor(
    @Inject(MainActivateCodeRepository) private readonly activateRepository: MainActivateCodeRepository,
    @Inject(UserMainRepository) private readonly userRepository: UserMainRepository,
  ) {}

  public async execute(payload: NewPasswordDto) {
    const activatedCode = await this.activateRepository.getItemByCode(payload.recoveryCode, ActivateCodeEnum.RECOVERY);
    if (!activatedCode || Date.now() > new Date(activatedCode.expireAt).getTime()) {
      throw new BadRequestException([
        {
          field: 'recoveryCode',
          message: 'if the inputModel has incorrect value (for incorrect password length)',
        },
      ]);
    }

    const passwordHash = await bcrypt.hash(payload.newPassword, 10);
    await Promise.all([
      // this.userRepository.updatePasswordUser(activatedCode.user, passwordHash),
      this.activateRepository.deleteByCode(payload.recoveryCode, ActivateCodeEnum.RECOVERY),
    ]);
  }
}
