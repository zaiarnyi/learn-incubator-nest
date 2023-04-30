import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { UserMainRepository } from '../../../../infrastructure/database/repositories/users/main.repository';

@Injectable()
export class DeleteUserAction {
  logger = new Logger(DeleteUserAction.name);
  constructor(private readonly repository: UserMainRepository) {}

  async execute(id: number): Promise<void> {
    await this.repository
      .deleteUserById(id)
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
