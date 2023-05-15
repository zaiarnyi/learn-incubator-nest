import { Inject, Injectable } from '@nestjs/common';
import { GetListQuestionsResponse } from '../../../../presentation/responses/sa/quiz/get-list-questions.response';
import { GetQuizListDto } from '../../../../domain/sa/quiz/dto/get-quiz-list.dto';
import { QueryQuizRepository } from '../../../../infrastructure/database/repositories/sa/quiz/query-quiz.repository';
import { plainToClass } from 'class-transformer';

@Injectable()
export class GetListQuestionAction {
  constructor(@Inject(QueryQuizRepository) private readonly queryRepository: QueryQuizRepository) {}
  public async execute(payload: GetQuizListDto): Promise<GetListQuestionsResponse> {
    const skip = (payload.pageNumber - 1) * payload.pageSize;
    const [quizList, totalCount] = await this.queryRepository.find({
      offset: skip,
      limit: payload.pageSize,
      term: payload.bodySearchTerm,
      sortBy: payload.sortBy,
      direction: payload.sortDirection,
      publishedStatus: payload.publishedStatus,
    });
    const pagesCount = Math.ceil(totalCount / payload.pageSize);
    return plainToClass(GetListQuestionsResponse, {
      pagesCount,
      page: payload.pageNumber,
      pageSize: payload.pageSize,
      totalCount,
      items: quizList.map((item) => {
        return {
          ...item,
          id: String(item.id),
          updatedAt: new Date(item.updatedAt).getTime() === new Date(item.createdAt).getTime() ? null : item.updatedAt,
        };
      }),
    });
  }
}
