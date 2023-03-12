import { CreateUserDto } from '../../../domain/users/dto/create-user.dto';
import { CreateUserVo } from '../../../domain/users/vo/create-user.vo';
import { UserMainRepository } from '../../../infrastructure/database/repositories/users/main.repository';
import { ConflictException, Inject, Logger } from '@nestjs/common';

export class CreateUserAction {
  logger = new Logger(CreateUserAction.name);
  constructor(
    @Inject(UserMainRepository)
    private readonly mainRepository: UserMainRepository,
  ) {}
  async execute(dto: CreateUserDto) {
    const user = new CreateUserVo(dto.login, dto.password, dto.email);
    await user.generateHash();
    await user.validate();

    return this.mainRepository.createUser(user).catch((e) => {
      this.logger.error(`Login: ${user.login}, Email: ${user.email}. Error create user: ${JSON.stringify(e)}`);
      throw new ConflictException('A user with this data has already been created');
    });
  }
}
