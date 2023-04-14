import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { BasicAuthGuard } from '../../../../domain/auth/guards/basic-auth.guard';

@UseGuards(BasicAuthGuard)
@Controller('sa/users')
export class SaUserController {
  @Get()
  async getUsers(@Query() query: any) {}

  @Post()
  async createUser(@Body() body: any) {}

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {}

  @Put(':id/ban')
  async banToUser(@Param('id') id: string) {}
}
