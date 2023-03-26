import { IsJWT, IsString } from 'class-validator';

export class LoginResponse {
  @IsString()
  @IsJWT()
  accessToken: string;
}
