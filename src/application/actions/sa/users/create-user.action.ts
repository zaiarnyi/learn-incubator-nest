import { CreateUserDto } from '../../../../domain/sa/users/dto/create-user.dto';
import { CreateUserVo } from '../../../../domain/users/vo/create-user.vo';
import { UserMainRepository } from '../../../../infrastructure/database/repositories/users/main.repository';
import { BadRequestException, Inject, Logger, UnauthorizedException } from '@nestjs/common';
import { validateOrReject } from 'class-validator';
import { UserQueryRepository } from '../../../../infrastructure/database/repositories/users/query.repository';
import { UserEntity } from '../../../../domain/users/entities/user.entity';
import * as bcrypt from 'bcryptjs';

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
  async execute(dto: CreateUserDto, isConfirm = false): Promise<UserEntity> {
    await this.validate(dto);

    const user = new UserEntity();
    user.email = dto.email;
    user.login = dto.login;
    user.passwordHash = await bcrypt.hash(dto.password, 10);
    user.isConfirm = isConfirm;

    return this.mainRepository.createUser(user).catch((e) => {
      this.logger.error(`Login: ${user.login}, Email: ${user.email}. Error create user: ${e.message}`);
      throw new BadRequestException();
    });
  }
}
