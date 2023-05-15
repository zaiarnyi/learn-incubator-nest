import { PublishedStatusEnum } from '../enums/published-status.enum';

export class FindQuizListDto {
  limit: number;

  offset: number;

  sortBy: string;

  direction: 'ASC' | 'DESC';

  term: string;

  publishedStatus: PublishedStatusEnum;
}
