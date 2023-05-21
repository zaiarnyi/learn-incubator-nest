import { ForbiddenException, Inject, Injectable, Logger } from '@nestjs/common';
import { AnswerResponse } from '../../../presentation/responses/pairs/get-current-pair.response';
import { UserEntity } from '../../../domain/users/entities/user.entity';
import { QueryPairsRepository } from '../../../infrastructure/database/repositories/pairs/query.repository';
import { QueryAnswerRepository } from '../../../infrastructure/database/repositories/pairs/answer/query-answer.repository';
import { PairsEntity } from '../../../domain/pairs/entity/pairs.entity';
import { PairAnswersEntity } from '../../../domain/pairs/entity/answers.entity';
import { AnswersStatusesEnum } from '../../../domain/pairs/enums/answers-statuses.enum';
import { MainPairRepository } from '../../../infrastructure/database/repositories/pairs/pair.repository';
import { PairStatusesEnum } from '../../../domain/pairs/enums/pair-statuses.enum';
import { plainToClass } from 'class-transformer';
import { AnswerPairRepository } from '../../../infrastructure/database/repositories/pairs/answer/answer-pair.repository';
import { QueryQuizRepository } from '../../../infrastructure/database/repositories/sa/quiz/query-quiz.repository';

@Injectable()
export class CreateAnswerAction {
  private readonly logger = new Logger(CreateAnswerAction.name);
  constructor(
    @Inject(QueryPairsRepository) protected readonly repository: QueryPairsRepository,
    @Inject(QueryAnswerRepository) private readonly answerRepository: QueryAnswerRepository,
    @Inject(MainPairRepository) private readonly mainPairRepository: MainPairRepository,
    @Inject(AnswerPairRepository) private readonly mainAnswerPairRepository: AnswerPairRepository,
    @Inject(QueryQuizRepository) private readonly quizRepository: QueryQuizRepository,
  ) {}

  private checkPlayer(activeGame: PairsEntity, user: UserEntity): { isSecondPlayer: boolean; isFirstPlayer: boolean } {
    const isFirstPlayer = activeGame.firstPlayer.id === user.id;
    const isSecondPlayer = activeGame.secondPlayer.id === user.id;

    return { isFirstPlayer, isSecondPlayer };
  }

  private async additionalScore(pairId: number, answers: PairAnswersEntity[], user: UserEntity) {
    if (!answers.some((item) => item.status === AnswersStatusesEnum.CORRECT)) {
      return null;
    }
    const pair = await this.repository.getPairByIdWithOutRelations(pairId);
    const { isFirstPlayer, isSecondPlayer } = this.checkPlayer(pair, user);
    if (isFirstPlayer) {
      await this.mainPairRepository.setScore(pairId, 'scoreFirstPlayer', pair.scoreFirstPlayer + 1);
    } else if (isSecondPlayer) {
      await this.mainPairRepository.setScore(pairId, 'scoreSecondPlayer', pair.scoreSecondPlayer + 1);
    }
  }

  private async getActiveGame(user: UserEntity): Promise<PairsEntity> {
    const findActivePlayers = await this.repository.getUserActiveGame(user);

    if (!findActivePlayers) {
      throw new ForbiddenException();
    }

    return findActivePlayers;
  }
  public async execute(answer: string, user: UserEntity): Promise<AnswerResponse | any> {
    const activeGame = await this.getActiveGame(user);

    const answersByPairId = await this.answerRepository.getPairById(activeGame.id);

    const countOfAnswersPlayer = answersByPairId.filter((item) => item.user.id === user.id).length;
    if (countOfAnswersPlayer >= 5) {
      throw new ForbiddenException();
    }

    const currentQuestion = activeGame.questions[countOfAnswersPlayer];

    if (!currentQuestion) {
      console.log(countOfAnswersPlayer, 'countOfAnswersPlayer');
      console.log(JSON.stringify(activeGame.questions, null, 2), 'ForbiddenException');
      throw new ForbiddenException();
    }
    const isCorrectAnswer = currentQuestion.correctAnswers.includes(answer) ?? false;

    const userAnswer = new PairAnswersEntity();
    userAnswer.pair = activeGame;
    userAnswer.user = user;
    userAnswer.status = isCorrectAnswer ? AnswersStatusesEnum.CORRECT : AnswersStatusesEnum.INCORRECT;
    userAnswer.question = currentQuestion;

    const saved = await this.mainAnswerPairRepository.save(userAnswer);

    const { isFirstPlayer, isSecondPlayer } = this.checkPlayer(activeGame, user);
    const isCorrect = userAnswer.status === AnswersStatusesEnum.CORRECT;

    if (isCorrect && isFirstPlayer) {
      await this.mainPairRepository.setScore(activeGame.id, 'scoreFirstPlayer', activeGame.scoreFirstPlayer + 1);
    } else if (isCorrect && isSecondPlayer) {
      await this.mainPairRepository.setScore(activeGame.id, 'scoreSecondPlayer', activeGame.scoreSecondPlayer + 1);
    }

    if (countOfAnswersPlayer === 4 && answersByPairId.length < 9) {
      await this.additionalScore(activeGame.id, [...answersByPairId, saved], user);
    }

    if ([...answersByPairId, saved].length >= 10) {
      await this.mainPairRepository.changeStatus(activeGame.id, PairStatusesEnum.FINISH);
    }
    console.log(JSON.stringify(currentQuestion, null, 2), 'currentQuestion================');
    return plainToClass(AnswerResponse, {
      addedAt: saved.addedAt,
      answerStatus: saved.status,
      questionId: currentQuestion.id.toString(),
    });
  }
}
