import { Module } from '@nestjs/common';
import { SaBlogsModule } from './blogs/sa-blogs.module';
import { SaUsersModule } from './users/sa-users.module';
import { SaQuizModule } from './quiz/sa-quiz.module';

@Module({
  imports: [SaBlogsModule, SaUsersModule, SaQuizModule],
  exports: [SaUsersModule],
})
export class SaModule {}
