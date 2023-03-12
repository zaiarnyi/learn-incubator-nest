import { Module } from '@nestjs/common';
import { BlogsController } from '../../presentation/controllers/blogs.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from '../../domain/blogs/entities/blog.entity';
import { MongoCollections } from '../database/mongo.collections';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Blog.name,
        schema: BlogSchema,
        collection: MongoCollections.BLOGS,
      },
    ]),
  ],
  controllers: [BlogsController],
  providers: [],
  exports: [],
})
export class BlogsModule {}
