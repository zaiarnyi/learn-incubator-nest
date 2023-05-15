import { MetaResponse } from '../../meta.response';
import { ValidateNested } from 'class-validator';
import { Exclude, Expose, Type } from 'class-transformer';
import { CreateQuizResponse } from './create-quiz.response';

@Exclude()
export class GetListQuestionsResponse extends MetaResponse {
  @ValidateNested()
  @Expose()
  @Type(() => CreateQuizResponse)
  items: CreateQuizResponse[];
}
