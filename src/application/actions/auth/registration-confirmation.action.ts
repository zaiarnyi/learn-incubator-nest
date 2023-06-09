import { BadRequestException, Inject, Injectable, Logger } from '@nestjs/common';
import { UserMainRepository } from '../../../infrastructure/database/repositories/users/main.repository';
import { MainActivateCodeRepository } from '../../../infrastructure/database/repositories/activate-code/main-activate-code.repository';
import { ActivateCodeEnum } from '../../../domain/auth/enums/activate-code.enum';
import { MainPairRepository } from '../../../infrastructure/database/repositories/pairs/pair.repository';
import { PairResultsEntity } from '../../../domain/pairs/entity/pairResults.entity';

@Injectable()
export class RegistrationConfirmationAction {
  logger = new Logger(RegistrationConfirmationAction.name);
  constructor(
    @Inject(MainActivateCodeRepository)
    private readonly activationRepository: MainActivateCodeRepository,
    @Inject(UserMainRepository)
    private readonly mainUserRepository: UserMainRepository,
    @Inject(MainPairRepository)
    private readonly pairRepository: MainPairRepository,
  ) {}

  public async execute(code: string) {
    const user = await this.activationRepository.getUserIdByCode(code, ActivateCodeEnum.REGISTRATION).catch((e) => {
      this.logger.error(`Error receiving user by activation code - ${code}. Error: ${JSON.stringify(e)}`);
      throw new BadRequestException([
        {
          message: 'User not found',
          field: 'code',
        },
      ]);
    });

    if (!user) {
      throw new BadRequestException([
        {
          message: 'User not found',
          field: 'code',
        },
      ]);
    }
    const pair = new PairResultsEntity();
    pair.user = user;

    await Promise.all([
      this.mainUserRepository.changeStatusConfirm(user.id, true),
      this.activationRepository.deleteByCode(code, ActivateCodeEnum.REGISTRATION),
      this.pairRepository.savePlayer(pair),
    ]).catch((e) => {
      this.logger.error(
        `Confirmation status change error for the user - ${user.id}. Code -  ${code}. Error: ${JSON.stringify(e)}`,
      );
      // throw new BadRequestException([
      //   {
      //     message: 'User not found',
      //     field: 'code',
      //   },
      // ]);
    });
  }
}
