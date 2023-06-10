import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Inject,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BasicAuthGuard } from '../../../../domain/auth/guards/basic-auth.guard';
import { GetAllUsersAction } from '../../../../application/actions/sa/users/get-all-users.action';
import { CreateUserAction } from '../../../../application/actions/sa/users/create-user.action';
import { DeleteUserAction } from '../../../../application/actions/sa/users/delete-user.action';
import { plainToClass } from 'class-transformer';
import { CreateUserResponse } from '../../../responses/sa/users/create-user.response';
import { GetUsersRequest } from '../../../requests/sa/users/get-users.request';
import { UserBannedRequest } from '../../../requests/sa/users/user-banned.request';
import { UserBannedAction } from '../../../../application/actions/sa/users/user-banned.action';
import { GetUsersResponse } from '../../../responses/sa/users/get-users.response';
import { CreateUserRequest } from '../../../requests/sa/users/create-user.request';
import { ApiOkResponse, ApiProperty, ApiTags } from '@nestjs/swagger';

@UseGuards(BasicAuthGuard)
@Controller('sa/users')
@ApiTags('sa/users')
export class SaUserController {
  constructor(
    @Inject(GetAllUsersAction) private readonly getUsersService: GetAllUsersAction,
    @Inject(CreateUserAction) private readonly createUserService: CreateUserAction,
    @Inject(DeleteUserAction) private readonly deleteUserService: DeleteUserAction,
    @Inject(UserBannedAction) private readonly banUserService: UserBannedAction,
  ) {}
  @Get()
  @ApiOkResponse({ type: GetUsersResponse })
  async getUsers(@Query() query: GetUsersRequest): Promise<GetUsersResponse> {
    return this.getUsersService.execute(query);
  }

  @Post()
  async createUser(@Body() body: CreateUserRequest): Promise<CreateUserResponse> {
    const createdUser = await this.createUserService.execute(body, true);
    return plainToClass(CreateUserResponse, {
      ...createdUser,
      id: createdUser.id.toString(),
      banInfo: { isBanned: false, banDate: null, banReason: null },
    });
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteUser(@Param('id') id: string) {
    if (isNaN(Number(id))) {
      throw new NotFoundException();
    }
    return this.deleteUserService.execute(Number(id));
  }

  @Put(':id/ban')
  @HttpCode(204)
  async banToUser(@Param('id', ParseIntPipe) id: string, @Body() body: UserBannedRequest) {
    if (isNaN(Number(id))) {
      throw new NotFoundException();
    }
    return this.banUserService.execute(Number(id), body);
  }
}
