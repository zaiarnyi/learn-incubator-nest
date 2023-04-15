import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../../domain/users/entities/user.entity';
import { MongoCollections } from '../database/mongo.collections';
import { UserQueryRepository } from '../database/repositories/users/query.repository';
import { UserMainRepository } from '../database/repositories/users/main.repository';

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
  controllers: [],
  providers: [UserQueryRepository, UserMainRepository],
  exports: [UserMainRepository, UserQueryRepository],
})
export class UsersModule {}
