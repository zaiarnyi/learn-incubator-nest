import { Module } from '@nestjs/common';
import { MainActivateCodeRepository } from '../database/repositories/activate-code/main-activate-code.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoCollections } from '../database/mongo.collections';
import { ActivateCode, ActivateCodeSchema } from '../database/entity/activate-code.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: ActivateCode.name,
        schema: ActivateCodeSchema,
        collection: MongoCollections.ACTIVATE_CODE,
      },
    ]),
  ],
  providers: [MainActivateCodeRepository],
  exports: [MainActivateCodeRepository],
})
export class ActivateCodeModule {}
