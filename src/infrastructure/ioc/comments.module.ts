import { Module } from '@nestjs/common';
import { CommentsController } from '../../presentation/controllers/comments.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Comment, CommentSchema } from '../../domain/comments/entities/comment.entity';
import { MongoCollections } from '../database/mongo.collections';
import { QueryCommentsRepository } from '../database/repositories/comments/query-comments.repository';
import { GetCommentByIdAction } from '../../application/actions/comments/getCommentById.action';
import { MainCommentsRepository } from '../database/repositories/comments/main-comments.repository';

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
  providers: [QueryCommentsRepository, GetCommentByIdAction, MainCommentsRepository],
  exports: [MainCommentsRepository],
})
export class CommentsModule {}
