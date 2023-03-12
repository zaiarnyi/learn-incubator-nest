import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { UserMainRepository } from '../../../infrastructure/database/repositories/users/main.repository';

@Injectable()
export class DeleteUserAction {
  logger = new Logger(DeleteUserAction.name);
  constructor(private readonly repository: UserMainRepository) {}

  async execute(id: string): Promise<void> {
    await this.repository
      .deleteUserById(id)
      .then((res) => {
        if (!res) {
          this.logger.error(`Error deleting user with ID - ${id}`);
          throw new NotFoundException('If specified user is not exists');
        }
      })
      .catch(() => {
        this.logger.error(`Error deleting user with ID - ${id}`);
        throw new NotFoundException('If specified user is not exists');
      });
  }
}
