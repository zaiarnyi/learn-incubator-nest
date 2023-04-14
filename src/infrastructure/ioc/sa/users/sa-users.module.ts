import { Module } from '@nestjs/common';
import { SaUserController } from '../../../../presentation/controllers/sa/users/sa-user.controller';

@Module({
  imports: [],
  controllers: [SaUserController],
  providers: [],
})
export class SaUsersModule {}
