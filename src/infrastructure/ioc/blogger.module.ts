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
import { GetCommentsByBlogsAction } from '../../application/actions/blogger/get-comments-by-blogs.action';
import { CommentsModule } from './comments.module';
import { BannedUserByBloggerAction } from '../../application/actions/blogger/users/banned-user-by-blogger.action';
import { SaUsersModule } from './sa/users/sa-users.module';
import { GetBannedUserAction } from '../../application/actions/blogger/users/get-banned-user.action';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../../domain/users/entities/user.entity';
import { MongoCollections } from '../database/mongo.collections';
import { Blog, BlogSchema } from '../../domain/blogs/entities/blog.entity';
import { Comment, CommentSchema } from '../../domain/comments/entities/comment.entity';

@Module({
  imports: [
    BlogsModule,
    PostsModule,
    UsersModule,
    JwtModule.registerAsync({
      useClass: JwtConfigService,
    }),
    CommentsModule,
    SaUsersModule,
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
        collection: MongoCollections.USERS,
      },
      {
        name: Blog.name,
        schema: BlogSchema,
        collection: MongoCollections.BLOGS,
      },
      {
        name: Comment.name,
        schema: CommentSchema,
        collection: MongoCollections.COMMENTS,
      },
    ]),
  ],
  controllers: [BloggerController],
  providers: [
    CreateBlogAction,
    UpdateBlogAction,
    DeleteBlogByIdAction,
    DeletePostByBlogIdAction,
    UpdatePostByBlogAction,
    GetCommentsByBlogsAction,
    BannedUserByBloggerAction,
    GetBannedUserAction,
  ],
})
export class BloggerModule {}
