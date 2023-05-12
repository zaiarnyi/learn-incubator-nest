import { Module } from '@nestjs/common';
import { InvalidUserTokensService } from '../../application/services/invalid-tokens/invalid-user-tokens.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvalidTokensEntity } from '../../domain/auth/entity/invalid-tokens.entity';

@Module({
  imports: [TypeOrmModule.forFeature([InvalidTokensEntity])],
  providers: [InvalidUserTokensService],
  exports: [InvalidUserTokensService],
})
export class InvalidTokensModule {}
