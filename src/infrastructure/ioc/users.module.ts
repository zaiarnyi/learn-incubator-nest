import { Module } from '@nestjs/common';
import { UsersController } from '../../presentation/controllers/users.contoller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../../domain/users/entities/user.entity';
import { MongoCollections } from '../database/mongo.collections';
import { GetAllUsersAction } from '../../application/actions/users/get-all-users.action';
import { UserQueryRepository } from '../database/repositories/users/query.repository';
import { UserMainRepository } from '../database/repositories/users/main.repository';
import { CreateUserAction } from '../../application/actions/users/create-user.action';
import { DeleteUserAction } from '../../application/actions/users/delete-user.action';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
        collection: MongoCollections.USERS,
      },
    ]),
  ],
  controllers: [UsersController],
  providers: [
    UserQueryRepository,
    UserMainRepository,
    GetAllUsersAction,
    CreateUserAction,
    DeleteUserAction,
  ],
  exports: [],
})
export class UsersModule {}
