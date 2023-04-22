import { Module } from '@nestjs/common';
import { SaBlogsControllers } from '../../../../presentation/controllers/sa/blogs/sa-blogs.controllers';
import { GetBlogsActions } from '../../../../application/actions/sa/blogs/get-blogs.actions';
import { BlogsModule } from '../../blogs.module';
import { BindBlogToUserAction } from '../../../../application/actions/sa/blogs/bind-blog-to-user.action';
import { UsersModule } from '../../users.module';
import { UpdateStatusBannedByBlogAction } from '../../../../application/actions/sa/blogs/update-status-banned-by-blog.action';
import { SaUsersModule } from '../users/sa-users.module';

@Module({
  imports: [BlogsModule, UsersModule, SaUsersModule],
  controllers: [SaBlogsControllers],
  providers: [GetBlogsActions, BindBlogToUserAction, UpdateStatusBannedByBlogAction],
})
export class SaBlogsModule {}
