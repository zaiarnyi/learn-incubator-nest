import { ForbiddenException, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
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

  private async plusScore(activeGame: PairsEntity, user: UserEntity, userAnswer: PairAnswersEntity): Promise<number> {
    const { isFirstPlayer, isSecondPlayer } = this.checkPlayer(activeGame, user);
    const isCorrect = userAnswer.status === AnswersStatusesEnum.CORRECT;
    const detectPlayer = isFirstPlayer ? 'scoreFirstPlayer' : isSecondPlayer ? 'scoreSecondPlayer' : null;
    if (!detectPlayer) return;

    if (!isCorrect) {
      return activeGame[detectPlayer];
    }
    const addScore = activeGame[detectPlayer] + 1;

    await this.mainPairRepository.setScore(activeGame.id, detectPlayer, addScore);
    return addScore;
  }

  private checkPlayer(activeGame: PairsEntity, user: UserEntity): { isSecondPlayer: boolean; isFirstPlayer: boolean } {
    const isFirstPlayer = activeGame.firstPlayer.id === user.id;
    const isSecondPlayer = activeGame.secondPlayer.id === user.id;

    return { isFirstPlayer, isSecondPlayer };
  }

  private async additionalScore(pair: PairsEntity, user: UserEntity, score: number, answers: PairAnswersEntity[]) {
    if (!score) return;
    if (!answers.some((a) => a.status === AnswersStatusesEnum.CORRECT)) {
      return null;
    }
    const { isFirstPlayer, isSecondPlayer } = this.checkPlayer(pair, user);
    if (!isFirstPlayer && !isSecondPlayer) return;

    const detectPlayer = isFirstPlayer ? 'scoreFirstPlayer' : 'scoreSecondPlayer';
    await this.mainPairRepository.setScore(pair.id, detectPlayer, score - 1);
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

    // if (!currentQuestion || !Object.keys(currentQuestion).length) {
    //   console.log(countOfAnswersPlayer, 'countOfAnswersPlayer');
    //   console.log(JSON.stringify(activeGame.questions, null, 2), 'ForbiddenException');
    //   throw new NotFoundException();
    // }
    console.log(currentQuestion.correctAnswers, 'currentQuestion.correctAnswers');
    console.log(answer, 'answer');
    const isCorrectAnswer = currentQuestion.correctAnswers.includes(answer) ?? false;

    const userAnswer = new PairAnswersEntity();
    userAnswer.pair = activeGame;
    userAnswer.user = user;
    userAnswer.status = isCorrectAnswer ? AnswersStatusesEnum.CORRECT : AnswersStatusesEnum.INCORRECT;
    userAnswer.question = currentQuestion;

    const saved = await this.mainAnswerPairRepository.save(userAnswer);
    console.log(saved.status, 'new PairAnswersEntity()');
    const playerScore = await this.plusScore(activeGame, user, userAnswer);

    const answers = [...answersByPairId, saved];
    const answersForUser = answers.filter((item) => item.user.id === user.id);

    if (answersForUser.length === 5 && answers.length < 10) {
      await this.additionalScore(activeGame, user, playerScore, answersForUser);
    }
    // console.log(
    //   answersForUser.length === 5,
    //   !activeGame.playerFirstFinish,
    //   answersForUser.some((a) => a.status === AnswersStatusesEnum.CORRECT, '1=1=1=1=1=1=1==1==1'),
    // );
    // if (
    //   answersForUser.length === 5 &&
    //   !activeGame.playerFirstFinish &&
    //   answersForUser.some((a) => a.status === AnswersStatusesEnum.CORRECT)
    // ) {
    //   console.log(JSON.stringify(activeGame, null, 2), 'activeGame');
    //   await this.mainPairRepository.setFinishFirstUser(activeGame.id, user.id);
    // }

    if (answers.length >= 10) {
      await this.mainPairRepository.changeStatus(activeGame.id, PairStatusesEnum.FINISH);
    }
    return plainToClass(AnswerResponse, {
      addedAt: saved.addedAt,
      answerStatus: saved.status,
      questionId: currentQuestion.id.toString(),
    });
  }
}
