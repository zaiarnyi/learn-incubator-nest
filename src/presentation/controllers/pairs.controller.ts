import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  Inject,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AnswerResponse, GetCurrentPairResponse } from '../responses/pairs/get-current-pair.response';
import { ConnectionPairAction } from '../../application/actions/pairs/connection.action';
import { JwtAuthGuard } from '../../domain/auth/guards/jwt-auth.guard';
import { UserEntity } from '../../domain/users/entities/user.entity';
import { GetMyCurrentAction } from '../../application/actions/pairs/get-my-current.action';
import { GetPairByIdAction } from '../../application/actions/pairs/get-pair-by-id.action';
import { CreateAnswerAction } from '../../application/actions/pairs/create-answer.action';

@Controller('pair-game-quiz/pairs')
@UseGuards(JwtAuthGuard)
export class PairsController {
  constructor(
    @Inject(ConnectionPairAction) private readonly connectionAction: ConnectionPairAction,
    @Inject(GetMyCurrentAction) private readonly getMyCurrentAction: GetMyCurrentAction,
    @Inject(GetPairByIdAction) private readonly getPairByIdAction: GetPairByIdAction,
    @Inject(CreateAnswerAction) private readonly createAnswerAction: CreateAnswerAction,
  ) {}
  @Get('my-current')
  async getMyCurrent(@Req() req: Request & { user: UserEntity }): Promise<GetCurrentPairResponse> {
    return this.getMyCurrentAction.execute(req.user);
  }

  @Get(':id')
  async getPaisById(
    @Param('id') id: string,
    @Req() req: Request & { user: UserEntity },
  ): Promise<GetCurrentPairResponse> {
    if (isNaN(Number(id))) {
      throw new BadRequestException([{ message: 'has invalid format', field: 'id' }]);
    }
    return this.getPairByIdAction.execute(Number(id), req.user);
  }

  @Post('connection')
  @HttpCode(200)
  async connection(@Req() req: Request & { user: UserEntity }): Promise<GetCurrentPairResponse> {
    return this.connectionAction.execute(req.user);
  }

  @Post('my-current/answers')
  @HttpCode(200)
  async answersMyCurrentPair(
    @Body('answer') answer: string,
    @Req() req: Request & { user: UserEntity },
  ): Promise<AnswerResponse> {
    return this.createAnswerAction.execute(answer, req.user);
  }
}
