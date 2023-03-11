import {
  Controller,
  Get,
  Inject,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { GetUsersRequest } from '../requests/users/get-users.request';
import { GetUsersResponse } from '../responses/users/get-users.response';
import { GetAllUsersAction } from '../../application/actions/users/get-all-users.action';

@Controller('users')
export class UsersController {
  constructor(private readonly getUsersService: GetAllUsersAction) {}
  @UsePipes(new ValidationPipe({ transform: true }))
  @Get()
  async getUsers(@Query() query: GetUsersRequest): Promise<GetUsersResponse> {
    return this.getUsersService.getAllUsers(query);
  }
}
