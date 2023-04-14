import { Controller, Get, Param, Put, Query, UseGuards } from '@nestjs/common';
import { BasicAuthGuard } from '../../../../domain/auth/guards/basic-auth.guard';

@UseGuards(BasicAuthGuard)
@Controller('sa/blogs')
export class SaBlogsControllers {
  constructor() {}

  @Get()
  async getBlogs(@Query() query: any) {}

  @Put(':id/bind-with-user/:userId')
  async bindUserToBlog(@Param() param: any) {}
}
