import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class CreateQuizResponse {
  @Expose()
  id: string;

  @Expose()
  body: string;

  @Expose()
  correctAnswers: Array<number | string>;

  @Expose()
  published: boolean;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
