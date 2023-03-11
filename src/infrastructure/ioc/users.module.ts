import { Module } from '@nestjs/common';
import { UsersController } from '../../presentation/controllers/users.contoller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../../domain/users/entities/user.entity';
import { MongoCollections } from '../database/mongo.collections';
import { GetAllUsersAction } from '../../application/actions/users/get-all-users.action';
import { QueryRepository } from '../database/repositories/users/query.repository';

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
  providers: [GetAllUsersAction, QueryRepository],
  exports: [],
})
export class UsersModule {}
