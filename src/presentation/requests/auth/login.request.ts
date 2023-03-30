import { IsString, validateOrReject } from 'class-validator';
import { BadRequestException } from '@nestjs/common';

export class LoginRequest {
  @IsString()
  loginOrEmail: string;

  @IsString()
  password: string;

  async validate() {
    try {
      await validateOrReject(this);
    } catch (e) {
      throw new BadRequestException([{ field: 'email or login or password', message: 'Incorrect value' }]);
    }
  }
}
