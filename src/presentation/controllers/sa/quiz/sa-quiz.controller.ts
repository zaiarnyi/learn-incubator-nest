import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Inject,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { GetQuestionsParamsRequest } from '../../../requests/sa/quiz/get-questions-params.request';
import { CreateQuizRequest } from '../../../requests/sa/quiz/create-quiz.request';
import { ChangeStatusRequest } from '../../../requests/sa/quiz/change-status.request';
import { GetListQuestionsResponse } from '../../../responses/sa/quiz/get-list-questions.response';
import { CreateQuizAction } from '../../../../application/actions/sa/quiz/create-quiz.action';
import { GetListQuestionAction } from '../../../../application/actions/sa/quiz/get-list-question.action';
import { ChangeQuizActions } from '../../../../application/actions/sa/quiz/change-quiz.actions';
import { DeleteQuizActions } from '../../../../application/actions/sa/quiz/delete-quiz.actions';
import { ChangeStatusQuizAction } from '../../../../application/actions/sa/quiz/change-status-quiz.action';
import { CreateQuizResponse } from '../../../responses/sa/quiz/create-quiz.response';
import { BasicAuthGuard } from '../../../../domain/auth/guards/basic-auth.guard';
import { ApiTags } from '@nestjs/swagger';

@Controller('sa/quiz/questions')
@ApiTags('sa/quiz/questions')
@UseGuards(BasicAuthGuard)
export class SaQuizController {
  constructor(
    @Inject(CreateQuizAction) private readonly createAction: CreateQuizAction,
    @Inject(GetListQuestionAction) private readonly getListQuizAction: GetListQuestionAction,
    @Inject(ChangeQuizActions) private readonly changeQuizAction: ChangeQuizActions,
    @Inject(ChangeStatusQuizAction) private readonly changeStatusQuizAction: ChangeStatusQuizAction,
    @Inject(DeleteQuizActions) private readonly deleteQuizAction: DeleteQuizActions,
  ) {}
  @Get()
  async getList(@Query() query: GetQuestionsParamsRequest): Promise<GetListQuestionsResponse> {
    return this.getListQuizAction.execute(query);
  }

  @Post()
  async create(@Body() body: CreateQuizRequest): Promise<CreateQuizResponse> {
    return this.createAction.execute(body);
  }

  @Put(':id')
  @HttpCode(204)
  async changeQuestion(@Param('id') id: string, @Body() body: CreateQuizRequest) {
    if (isNaN(Number(id))) {
      throw new NotFoundException();
    }
    await this.changeQuizAction.execute(Number(id), body);
  }

  @Put(':id/publish')
  @HttpCode(204)
  async changeStatus(@Param('id') id: string, @Body() body: ChangeStatusRequest) {
    if (isNaN(Number(id))) {
      throw new NotFoundException();
    }
    await this.changeStatusQuizAction.execute(Number(id), body);
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteQuestion(@Param('id') id: string) {
    if (isNaN(Number(id))) {
      throw new NotFoundException();
    }
    await this.deleteQuizAction.execute(Number(id));
  }
}
