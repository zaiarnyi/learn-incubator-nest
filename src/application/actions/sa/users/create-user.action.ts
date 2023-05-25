import { CreateUserDto } from '../../../../domain/sa/users/dto/create-user.dto';
import { UserMainRepository } from '../../../../infrastructure/database/repositories/users/main.repository';
import { BadRequestException, Inject, Logger, UnauthorizedException } from '@nestjs/common';
import { validateOrReject } from 'class-validator';
import { UserQueryRepository } from '../../../../infrastructure/database/repositories/users/query.repository';
import { UserEntity } from '../../../../domain/users/entities/user.entity';
import * as bcrypt from 'bcryptjs';
import { MainPairRepository } from '../../../../infrastructure/database/repositories/pairs/pair.repository';
import { PairResultsEntity } from '../../../../domain/pairs/entity/pairResults.entity';

export class CreateUserAction {
  logger = new Logger(CreateUserAction.name);
  constructor(
    @Inject(UserMainRepository)
    private readonly mainRepository: UserMainRepository,
    @Inject(UserQueryRepository) private readonly queryRepository: UserQueryRepository,
    @Inject(MainPairRepository)
    private readonly pairRepository: MainPairRepository,
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

    const userCreated = await this.mainRepository.createUser(user).catch((e) => {
      this.logger.error(`Login: ${user.login}, Email: ${user.email}. Error create user: ${e.message}`);
      throw new BadRequestException();
    });

    const pair = new PairResultsEntity();
    pair.user = user;

    await this.pairRepository.savePlayer(pair);

    return userCreated;
  }
}
