import { Body, Controller, Delete, Get, HttpCode, Param, Post, Query, UseGuards } from '@nestjs/common';
import { GetUsersRequest } from '../requests/users/get-users.request';
import { GetUsersResponse } from '../responses/users/get-users.response';
import { GetAllUsersAction } from '../../application/actions/users/get-all-users.action';
import { CreateUserRequest } from '../requests/users/create-user.request';
import { CreateUserResponse } from '../responses/users/create-user.response';
import { plainToClass } from 'class-transformer';
import { CreateUserAction } from '../../application/actions/users/create-user.action';
import { DeleteUserAction } from '../../application/actions/users/delete-user.action';
import { JwtAuthGuard } from '../../domain/auth/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(
    private readonly getUsersService: GetAllUsersAction,
    private readonly createUserService: CreateUserAction,
    private readonly deleteUserService: DeleteUserAction,
  ) {}
  @UseGuards(JwtAuthGuard)
  @Get()
  async getUsers(@Query() query: GetUsersRequest): Promise<GetUsersResponse> {
    return this.getUsersService.execute(query);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createUser(@Body() body: CreateUserRequest): Promise<CreateUserResponse> {
    const createdUser = await this.createUserService.execute(body, true);
    return plainToClass(CreateUserResponse, createdUser);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(204)
  async deleteUserById(@Param('id') id: string): Promise<void> {
    await this.deleteUserService.execute(id);
  }
}
