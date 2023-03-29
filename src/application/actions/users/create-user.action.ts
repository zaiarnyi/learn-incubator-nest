import { CreateUserDto } from '../../../domain/users/dto/create-user.dto';
import { CreateUserVo } from '../../../domain/users/vo/create-user.vo';
import { UserMainRepository } from '../../../infrastructure/database/repositories/users/main.repository';
import { BadRequestException, Inject, Logger, UnauthorizedException } from '@nestjs/common';
import { validateOrReject } from 'class-validator';
import { UserQueryRepository } from '../../../infrastructure/database/repositories/users/query.repository';

export class CreateUserAction {
  logger = new Logger(CreateUserAction.name);
  constructor(
    @Inject(UserMainRepository)
    private readonly mainRepository: UserMainRepository,
    @Inject(UserQueryRepository) private readonly queryRepository: UserQueryRepository,
  ) {}

  private async validate(dto: CreateUserDto) {
    try {
      await validateOrReject(dto);
    } catch (e) {
      this.logger.error(`failed validated dto - ${JSON.stringify(dto)}`);
      throw new UnauthorizedException();
    }
    const user = await this.queryRepository.getUserByEmailOrLogin(dto.login, dto.email);
    if (user) {
      this.logger.error(`user is already - login: ${dto.login}, email ${dto.email}`);
      throw new UnauthorizedException();
    }
  }
  async execute(dto: CreateUserDto, isConfirm = false) {
    await this.validate(dto);

    const user = new CreateUserVo(dto.login, dto.password, dto.email, isConfirm);
    await user.generateHash();
    await user.validate();

    return this.mainRepository.createUser(user).catch((e) => {
      this.logger.error(`Login: ${user.login}, Email: ${user.email}. Error create user: ${JSON.stringify(e)}`);
      throw new BadRequestException('A user with this data has already been created');
    });
  }
}
