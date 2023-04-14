import { Module } from '@nestjs/common';
import { SaBlogsControllers } from '../../../../presentation/controllers/sa/blogs/sa-blogs.controllers';

@Module({
  imports: [],
  controllers: [SaBlogsControllers],
  providers: [],
})
export class SaBlogsModule {}
