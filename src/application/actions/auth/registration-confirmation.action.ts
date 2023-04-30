import { BadRequestException, Inject, Injectable, Logger } from '@nestjs/common';
import { UserMainRepository } from '../../../infrastructure/database/repositories/users/main.repository';
import { MainActivateCodeRepository } from '../../../infrastructure/database/repositories/activate-code/main-activate-code.repository';
import { ActivateCodeEnum } from '../../../domain/auth/entity/activate-code.entity';

@Injectable()
export class RegistrationConfirmationAction {
  logger = new Logger(RegistrationConfirmationAction.name);
  constructor(
    @Inject(MainActivateCodeRepository)
    private readonly activationRepository: MainActivateCodeRepository,
    @Inject(UserMainRepository)
    private readonly mainUserRepository: UserMainRepository,
  ) {}

  public async execute(code: string) {
    const userId = await this.activationRepository.getUserIdByCode(code, ActivateCodeEnum.REGISTRATION).catch((e) => {
      this.logger.error(`Error receiving user by activation code - ${code}. Error: ${JSON.stringify(e)}`);
      throw new BadRequestException([
        {
          message: 'User not found',
          field: 'code',
        },
      ]);
    });
    console.log(userId, 'userId');
    if (!userId) {
      throw new BadRequestException([
        {
          message: 'User not found',
          field: 'code',
        },
      ]);
    }
    await this.mainUserRepository.changeStatusConfirm(userId, true).catch((e) => {
      this.logger.error(
        `Confirmation status change error for the user - ${userId}. Code -  ${code}. Error: ${JSON.stringify(e)}`,
      );
      throw new BadRequestException([
        {
          message: 'User not found',
          field: 'code',
        },
      ]);
    });
    await this.activationRepository.deleteByCode(code, ActivateCodeEnum.REGISTRATION).catch((e) => {
      this.logger.error(`Error deleting activation code - ${code}. Error: ${JSON.stringify(e)}`);
    });
  }
}
