import { Module } from '@nestjs/common';
import { BloggerController } from '../../presentation/controllers/blogger.controller';
import { BlogsModule } from './blogs.module';
import { CreateBlogAction } from '../../application/actions/blogger/create-blog.action';
import { UpdateBlogAction } from '../../application/actions/blogger/update-blog.action';
import { DeleteBlogByIdAction } from '../../application/actions/blogger/delete-blogById.action';
import { PostsModule } from './posts.module';
import { UsersModule } from './users.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtConfigService } from '../configs/jwt/jwt.config';
import { DeletePostByBlogIdAction } from '../../application/actions/blogger/delete-post-by-blogId.action';
import { UpdatePostByBlogAction } from '../../application/actions/blogger/update-post-by-blog.action';

@Module({
  imports: [
    BlogsModule,
    PostsModule,
    UsersModule,
    JwtModule.registerAsync({
      useClass: JwtConfigService,
    }),
  ],
  controllers: [BloggerController],
  providers: [
    CreateBlogAction,
    UpdateBlogAction,
    DeleteBlogByIdAction,
    DeletePostByBlogIdAction,
    UpdatePostByBlogAction,
  ],
})
export class BloggerModule {}
