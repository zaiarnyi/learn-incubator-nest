import { IsString, validateOrReject } from 'class-validator';
import { BadRequestException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class LoginRequest {
  @IsString()
  @ApiProperty({ type: String, nullable: false, example: 'zaiarnyi', required: true })
  loginOrEmail: string;

  @IsString()
  @ApiProperty({ type: String, nullable: false, example: '123123123', required: true })
  password: string;

  async validate() {
    try {
      await validateOrReject(this);
    } catch (e) {
      throw new BadRequestException([{ field: 'email or login or password', message: 'Incorrect value' }]);
    }
  }
}
