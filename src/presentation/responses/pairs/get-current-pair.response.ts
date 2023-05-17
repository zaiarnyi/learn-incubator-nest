import { Exclude, Expose, Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { PairStatusesEnum } from '../../../domain/pairs/enums/pair-statuses.enum';
import { AnswersStatusesEnum } from '../../../domain/pairs/enums/answers-statuses.enum';

@Exclude()
export class Question {
  @Expose()
  'id': string;

  @Expose()
  'body': string;
}

@Exclude()
export class Player {
  @Expose()
  id: string;

  @Exclude()
  login: string;
}

@Exclude()
export class AnswerResponse {
  @Expose()
  questionId: string;

  @Expose()
  answerStatus: AnswersStatusesEnum;

  @Expose()
  addedAt: Date;
}

@Exclude()
export class FirstAndSecondPlayer {
  @ValidateNested()
  @Type(() => AnswerResponse)
  @Expose()
  answers: AnswerResponse[];

  @ValidateNested()
  @Type(() => Player)
  @Expose()
  player: Player;

  @Expose()
  score: number;
}

@Exclude()
export class GetCurrentPairResponse {
  @Expose()
  id: string;

  @ValidateNested()
  @Type(() => FirstAndSecondPlayer)
  @Expose()
  firstPlayerProgress: FirstAndSecondPlayer;

  @ValidateNested()
  @Type(() => FirstAndSecondPlayer)
  @Expose()
  secondPlayerProgress: FirstAndSecondPlayer;

  @ValidateNested()
  @Type(() => Question)
  @Expose()
  questions: Question[];

  @Expose()
  status: PairStatusesEnum;

  @Expose()
  pairCreatedDate: Date;

  @Expose()
  startGameDate: Date;

  @Expose()
  finishGameDate: Date;
}
