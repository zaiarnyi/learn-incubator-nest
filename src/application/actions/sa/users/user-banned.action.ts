import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { MainUserBannedRepository } from '../../../../infrastructure/database/repositories/sa/users/main-user-banned.repository';
import { UserQueryRepository } from '../../../../infrastructure/database/repositories/users/query.repository';
import { UserBannedDto } from '../../../../domain/sa/users/dto/user-banned.dto';

@Injectable()
export class UserBannedAction {
  constructor(
    @Inject(MainUserBannedRepository) private readonly repository: MainUserBannedRepository,
    @Inject(UserQueryRepository) private readonly userRepository: UserQueryRepository,
  ) {}

  private async validate(userId: string) {
    const user = await this.userRepository.getUserById(userId);
    if (!user) {
      throw new NotFoundException();
    }
  }

  public async execute(userId: string, body: UserBannedDto) {
    await this.validate(userId);
    if (body.isBanned) {
      await this.repository.setUserBan(userId, body.banReason);
    } else {
      await this.repository.deleteBan(userId);
    }
  }
}
