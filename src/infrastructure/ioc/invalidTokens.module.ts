import { Module } from '@nestjs/common';
import { InvalidUserTokensService } from '../../application/services/invalid-tokens/invalid-user-tokens.service';

@Module({
  imports: [],
  providers: [InvalidUserTokensService],
  exports: [InvalidUserTokensService],
})
export class InvalidTokensModule {}
