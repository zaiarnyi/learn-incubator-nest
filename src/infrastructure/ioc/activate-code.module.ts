import { Module } from '@nestjs/common';
import { MainActivateCodeRepository } from '../database/repositories/activate-code/main-activate-code.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivateEmailsCodeEntity } from '../../domain/auth/entity/activate-code.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ActivateEmailsCodeEntity])],
  providers: [MainActivateCodeRepository],
  exports: [MainActivateCodeRepository],
})
export class ActivateCodeModule {}
