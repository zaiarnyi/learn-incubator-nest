import { Module } from '@nestjs/common';
import { IntegrationController } from '../../presentation/controllers/integration.controller';

@Module({
  imports: [],
  controllers: [IntegrationController],
  providers: [],
})
export class IntegrationModule {}
