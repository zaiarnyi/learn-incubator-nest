import { IsString } from 'class-validator';

export class LoginRequest {
  @IsString()
  loginOrEmail: string;

  @IsString()
  password: string;
}
