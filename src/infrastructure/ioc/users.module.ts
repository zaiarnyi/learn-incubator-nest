import { Module } from '@nestjs/common';
import { UsersController } from '../../presentation/controllers/users.contoller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../../domain/entities/user.entity';
import { MongoCollections } from '../database/mongo.collections';

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
  providers: [],
  exports: [],
})
export class UsersModule {}
