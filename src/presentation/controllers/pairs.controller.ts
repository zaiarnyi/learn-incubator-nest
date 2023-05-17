import {
  Body,
  Controller,
  Get,
  HttpCode,
  Inject,
  NotFoundException,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AnswerResponse, GetCurrentPairResponse } from '../responses/pairs/get-current-pair.response';
import { ConnectionPairAction } from '../../application/actions/pairs/connection.action';
import { JwtAuthGuard } from '../../domain/auth/guards/jwt-auth.guard';
import { UserEntity } from '../../domain/users/entities/user.entity';

@Controller('pair-game-quiz/pairs')
@UseGuards(JwtAuthGuard)
export class PairsController {
  constructor(@Inject(ConnectionPairAction) private readonly connectionAction: ConnectionPairAction) {}
  @Get('my-current')
  async getMyCurrent(): Promise<GetCurrentPairResponse | any> {}

  @Get(':id')
  async getPaisById(@Param('id') id: string): Promise<GetCurrentPairResponse | any> {
    if (isNaN(Number(id))) {
      throw new NotFoundException();
    }
  }

  @Post('connection')
  @HttpCode(200)
  async connection(@Req() req: Request & { user: UserEntity }): Promise<GetCurrentPairResponse> {
    return this.connectionAction.execute(req.user);
  }

  @Post('my-current/answers')
  @HttpCode(200)
  async answersMyCurrentPair(@Body('answer') answer: string): Promise<AnswerResponse | any> {}
}
