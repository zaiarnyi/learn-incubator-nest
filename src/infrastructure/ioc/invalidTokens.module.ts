import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InvalidTokens, InvalidTokensSchema } from '../database/entity/invalid-tokens.entity';
import { MongoCollections } from '../database/mongo.collections';
import { InvalidUserTokensService } from '../../application/services/invalid-tokens/invalid-user-tokens.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: InvalidTokens.name,
        schema: InvalidTokensSchema,
        collection: MongoCollections.INVALID_USER_TOKENS,
      },
    ]),
  ],
  providers: [InvalidUserTokensService],
  exports: [InvalidUserTokensService],
})
export class InvalidTokensModule {}
