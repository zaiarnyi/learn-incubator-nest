import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QuizEntity } from '../../../../../domain/sa/quiz/entities/quiz.entity';
import { Repository } from 'typeorm';
import { FindQuizListDto } from '../../../../../domain/sa/quiz/dto/find-quiz-list.dto';
import { PublishedStatusEnum } from '../../../../../domain/sa/quiz/enums/published-status.enum';

@Injectable()
export class QueryQuizRepository {
  constructor(@InjectRepository(QuizEntity) private readonly repository: Repository<QuizEntity>) {}

  async findById(id: number): Promise<QuizEntity> {
    return this.repository.findOneByOrFail({ id });
  }

  async find(options: FindQuizListDto): Promise<[QuizEntity[], number]> {
    const query = this.repository.createQueryBuilder('q');

    if (options?.term?.length) {
      query.andWhere('q.body ILIKE :term', { term: options.term });
    }

    if (options.publishedStatus === PublishedStatusEnum.PUBLISHED) {
      query.andWhere('q."publishedStatus" = true');
    } else if (options.publishedStatus === PublishedStatusEnum.NOT_PUBLISHED) {
      query.andWhere('q."publishedStatus" = false');
    }

    return query
      .offset(options.offset)
      .limit(options.limit)
      .orderBy(`q.${options.sortBy}`, options.direction)
      .getManyAndCount();
  }
}
