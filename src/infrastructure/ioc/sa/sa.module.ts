import { Module } from '@nestjs/common';
import { SaBlogsModule } from './blogs/sa-blogs.module';
import { SaUsersModule } from './users/sa-users.module';

@Module({
  imports: [SaBlogsModule, SaUsersModule],
  exports: [SaUsersModule],
})
export class SaModule {}
