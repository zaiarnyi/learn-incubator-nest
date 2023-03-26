import { IsEmail, IsString, Length, Matches } from 'class-validator';

export class RegistrationRequest {
  @IsString()
  @Length(3, 10)
  @Matches(/^[a-zA-Z0-9_-]*$/)
  login: string;

  @IsString()
  @Length(6, 20)
  password: string;

  @IsEmail()
  @Matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
  email: string;
}
