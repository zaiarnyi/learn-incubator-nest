import { Module } from '@nestjs/common';
import { CommentsController } from '../../presentation/controllers/comments.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Comment,
  CommentSchema,
} from '../../domain/comments/entities/comment.entity';
import { MongoCollections } from '../database/mongo.collections';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Comment.name,
        schema: CommentSchema,
        collection: MongoCollections.COMMENTS,
      },
    ]),
  ],
  controllers: [CommentsController],
  providers: [],
  exports: [],
})
export class CommentsModule {}
