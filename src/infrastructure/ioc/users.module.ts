import { Module } from '@nestjs/common';
import { UserQueryRepository } from '../database/repositories/users/query.repository';
import { UserMainRepository } from '../database/repositories/users/main.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../../domain/users/entities/user.entity';
import { InvalidTokensEntity } from '../../domain/auth/entity/invalid-tokens.entity';
import { SecurityEntity } from '../../domain/security/entity/security.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, InvalidTokensEntity, SecurityEntity])],
  controllers: [],
  providers: [UserQueryRepository, UserMainRepository],
  exports: [UserMainRepository, UserQueryRepository],
})
export class UsersModule {}
