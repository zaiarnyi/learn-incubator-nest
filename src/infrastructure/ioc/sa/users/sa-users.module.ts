import { Module } from '@nestjs/common';
import { SaUserController } from '../../../../presentation/controllers/sa/users/sa-user.controller';
import { GetAllUsersAction } from '../../../../application/actions/sa/users/get-all-users.action';
import { CreateUserAction } from '../../../../application/actions/sa/users/create-user.action';
import { DeleteUserAction } from '../../../../application/actions/sa/users/delete-user.action';
import { UsersModule } from '../../users.module';
import { UserBannedAction } from '../../../../application/actions/sa/users/user-banned.action';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoCollections } from '../../../database/mongo.collections';
import { UserBanned, UserBannedSchema } from '../../../../domain/sa/users/entities/user-bans.entity';
import { QueryUserBannedRepository } from '../../../database/repositories/sa/users/query-user-banned.repository';
import { MainUserBannedRepository } from '../../../database/repositories/sa/users/main-user-banned.repository';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeature([
      {
        name: UserBanned.name,
        schema: UserBannedSchema,
        collection: MongoCollections.USER_BANS,
      },
    ]),
  ],
  controllers: [SaUserController],
  providers: [
    GetAllUsersAction,
    CreateUserAction,
    DeleteUserAction,
    UserBannedAction,
    QueryUserBannedRepository,
    MainUserBannedRepository,
  ],
  exports: [QueryUserBannedRepository, MainUserBannedRepository],
})
export class SaUsersModule {}
