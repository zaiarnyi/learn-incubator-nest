import { Injectable } from '@nestjs/common';
import { CommentsEntity } from '../../../../domain/comments/entities/comment.entity';
import { DeleteResult } from 'mongodb';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { ChangeCommentByIdDto } from '../../../../domain/comments/dto/change-comment-by-id.dto';

@Injectable()
export class MainCommentsRepository {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    @InjectRepository(CommentsEntity) private readonly repository: Repository<CommentsEntity>,
  ) {}

  async changeCommentById(id: number, body: ChangeCommentByIdDto) {
    await this.repository.update({ id }, { content: body.content });
  }

  async removeCommentById(id: number) {
    return this.repository.delete({ id });
  }

  async createComment(body: CommentsEntity): Promise<CommentsEntity> {
    return this.repository.save(body);
  }

  async changeBannedStatus(userId: number, isBanned: boolean): Promise<any> {
    return this.repository.update({ user: { id: userId } }, { isBanned });
  }

  async changeBannedStatusByBlogger(userId: number, blogId: number, isBanned: boolean): Promise<any> {
    return this.repository.update({ user: { id: userId }, blog: { id: blogId } }, { isBanned });
  }
}
