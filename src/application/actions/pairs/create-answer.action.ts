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
import { PairResultsEntity } from '../../../domain/pairs/entity/pairResults.entity';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class CreateAnswerAction {
  private readonly logger = new Logger(CreateAnswerAction.name);
  constructor(
    @Inject(QueryPairsRepository) protected readonly repository: QueryPairsRepository,
    @Inject(QueryAnswerRepository) private readonly answerRepository: QueryAnswerRepository,
    @Inject(MainPairRepository) private readonly mainPairRepository: MainPairRepository,
    @Inject(AnswerPairRepository) private readonly mainAnswerPairRepository: AnswerPairRepository,
    @Inject(QueryQuizRepository) private readonly quizRepository: QueryQuizRepository,
    @InjectQueue('pairs') private pairsQueue: Queue,
  ) {}

  private async plusScore(activeGame: PairsEntity, user: UserEntity, userAnswer: PairAnswersEntity): Promise<number> {
    const { isFirstPlayer, isSecondPlayer } = this.checkPlayer(activeGame, user);
    const isCorrect = userAnswer.status === AnswersStatusesEnum.CORRECT;
    const detectPlayer = isFirstPlayer ? 'scoreFirstPlayer' : isSecondPlayer ? 'scoreSecondPlayer' : null;
    if (!detectPlayer || !isCorrect) return;

    const addScore = activeGame[detectPlayer] + 1;

    await this.mainPairRepository.setScore(activeGame.id, detectPlayer, addScore);
  }

  private checkPlayer(activeGame: PairsEntity, user: UserEntity): { isSecondPlayer: boolean; isFirstPlayer: boolean } {
    const isFirstPlayer = activeGame.firstPlayer.id === user.id;
    const isSecondPlayer = activeGame.secondPlayer.id === user.id;

    return { isFirstPlayer, isSecondPlayer };
  }

  private async updatePairResult(pairId: number) {
    const game = await this.repository.getPairsById(pairId);

    const [firstPlayer, secondPlayer] = await Promise.all([
      this.repository.getPlayerResult(game.firstPlayer),
      this.repository.getPlayerResult(game.secondPlayer),
    ]);

    const winIsFirstPlayer = game.scoreFirstPlayer > game.scoreSecondPlayer;
    const winIsSecondPlayer = game.scoreFirstPlayer < game.scoreSecondPlayer;
    const drawPlayers = game.scoreFirstPlayer === game.scoreSecondPlayer;
    const lossesIsFirstPlayers = game.scoreFirstPlayer < game.scoreSecondPlayer;
    const lossesIsSecondPlayers = game.scoreFirstPlayer > game.scoreSecondPlayer;

    const firstPlayerResult = new PairResultsEntity();
    firstPlayerResult.winsCount = firstPlayer.winsCount + Number(winIsFirstPlayer);
    firstPlayerResult.drawsCount = firstPlayer.drawsCount + Number(drawPlayers);
    firstPlayerResult.lossesCount = firstPlayer.lossesCount + Number(lossesIsFirstPlayers);
    firstPlayerResult.sumScore = firstPlayer.sumScore + game.scoreFirstPlayer;
    firstPlayerResult.avgScores = parseFloat(
      (
        firstPlayerResult.sumScore /
        (firstPlayerResult.winsCount + firstPlayerResult.drawsCount + firstPlayerResult.lossesCount)
      ).toFixed(2),
    );

    const secondPlayerResult = new PairResultsEntity();
    secondPlayerResult.winsCount = secondPlayer.winsCount + Number(winIsSecondPlayer);
    secondPlayerResult.drawsCount = secondPlayer.drawsCount + Number(drawPlayers);
    secondPlayerResult.lossesCount = secondPlayer.lossesCount + Number(lossesIsSecondPlayers);
    secondPlayerResult.sumScore = secondPlayer.sumScore + game.scoreSecondPlayer;
    secondPlayerResult.avgScores = parseFloat(
      (
        secondPlayerResult.sumScore /
        (secondPlayerResult.winsCount + secondPlayerResult.drawsCount + secondPlayerResult.lossesCount)
      ).toFixed(2),
    );

    if (isNaN(secondPlayerResult.avgScores)) {
      secondPlayerResult.avgScores = 0;
    }

    if (isNaN(firstPlayerResult.avgScores)) {
      firstPlayerResult.avgScores = 0;
    }

    await Promise.all([
      this.mainPairRepository.updatePlayerResults(game.firstPlayer, firstPlayerResult),
      this.mainPairRepository.updatePlayerResults(game.secondPlayer, secondPlayerResult),
    ]);
  }

  private async additionalScore(user: UserEntity, answers: PairAnswersEntity[], pair: PairsEntity) {
    const answersForUser = answers.filter((item) => item.user.id !== user.id);
    if (answersForUser.every((a) => a.status === AnswersStatusesEnum.INCORRECT)) {
      return null;
    }
    const { isFirstPlayer, isSecondPlayer } = this.checkPlayer(pair, user);
    if (!isFirstPlayer && !isSecondPlayer) return;

    const detectPlayer = !isFirstPlayer ? 'scoreFirstPlayer' : 'scoreSecondPlayer';
    const score = pair[detectPlayer];
    await this.mainPairRepository.setScore(pair.id, detectPlayer, score + 1);
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

    const isCorrectAnswer = currentQuestion.correctAnswers.includes(answer) ?? false;

    const userAnswer = new PairAnswersEntity();
    userAnswer.pair = activeGame;
    userAnswer.user = user;
    userAnswer.status = isCorrectAnswer ? AnswersStatusesEnum.CORRECT : AnswersStatusesEnum.INCORRECT;
    userAnswer.question = currentQuestion;

    const saved = await this.mainAnswerPairRepository.save(userAnswer);
    await this.plusScore(activeGame, user, userAnswer);

    const answers = [...answersByPairId, saved];

    if (answers.length >= 10) {
      await Promise.all([
        this.mainPairRepository.changeStatus(activeGame.id, PairStatusesEnum.FINISH),
        this.additionalScore(user, answers, activeGame),
      ]);
      await this.updatePairResult(activeGame.id);
    }
    if (countOfAnswersPlayer === 4 && answers.length < 10) {
      await this.pairsQueue.add(
        'finish',
        { pairId: activeGame.id, userId: user.id },
        {
          delay: 10 * 1000,
          attempts: 1,
          timeout: 1000 * 60 * 5,
          backoff: 0,
          removeOnComplete: true,
          removeOnFail: true,
        },
      );
    }
    return plainToClass(AnswerResponse, {
      addedAt: saved.addedAt,
      answerStatus: saved.status,
      questionId: currentQuestion.id.toString(),
    });
  }
}
