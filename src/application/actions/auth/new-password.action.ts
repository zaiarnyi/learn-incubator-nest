import { BadRequestException, Inject, Injectable, Logger } from '@nestjs/common';
import { NewPasswordDto } from '../../../domain/auth/dto/new-password.dto';
import { MainActivateCodeRepository } from '../../../infrastructure/database/repositories/activate-code/main-activate-code.repository';
import { ActivateCodeEnum } from '../../../domain/auth/entity/activate-code.entity';
import * as bcrypt from 'bcryptjs';
import { UserMainRepository } from '../../../infrastructure/database/repositories/users/main.repository';

@Injectable()
export class NewPasswordAction {
  private logger = new Logger(NewPasswordAction.name);
  constructor(
    @Inject(MainActivateCodeRepository) private readonly activateRepository: MainActivateCodeRepository,
    @Inject(UserMainRepository) private readonly userRepository: UserMainRepository,
  ) {}

  public async execute(payload: NewPasswordDto) {
    const activatedCode = await this.activateRepository.getItemByCode(payload.recoveryCode, ActivateCodeEnum.RECOVERY);
    if (!activatedCode || Date.now() > activatedCode.expireAt) {
      throw new BadRequestException([
        {
          field: 'recoveryCode',
          message: 'if the inputModel has incorrect value (for incorrect password length)',
        },
      ]);
    }

    const passwordHash = await bcrypt.hash(payload.newPassword, 10);
    await Promise.all([
      this.userRepository.updatePasswordUser(activatedCode.user as number, passwordHash),
      this.activateRepository.deleteByCode(payload.recoveryCode, ActivateCodeEnum.RECOVERY),
    ]);
  }
}
