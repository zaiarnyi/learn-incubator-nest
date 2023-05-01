import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { UserMainRepository } from '../../../../infrastructure/database/repositories/users/main.repository';
import { UserQueryRepository } from '../../../../infrastructure/database/repositories/users/query.repository';

@Injectable()
export class DeleteUserAction {
  logger = new Logger(DeleteUserAction.name);
  constructor(
    private readonly repository: UserMainRepository,
    @Inject(UserQueryRepository) private readonly queryRepository: UserQueryRepository,
  ) {}

  async execute(id: string): Promise<void> {
    if (isNaN(Number(id)) || typeof Number(id) !== 'number') {
      throw new NotFoundException();
    }
    const user = await this.queryRepository.getUserById(parseInt(id));
    if (!user) {
      throw new NotFoundException();
    }
    await this.repository
      .deleteUserById(parseInt(id))
      .then((res) => {
        if (!res) {
          this.logger.warn(`Not found user with ID - ${id}`);
          throw new NotFoundException();
        }
      })
      .catch(() => {
        this.logger.error(`Error deleting user with ID - ${id}`);
        throw new NotFoundException();
      });
  }
}
