import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class CreateUserRequest {
  @MinLength(3)
  @MaxLength(10)
  @Matches(/^[a-zA-Z0-9_-]*$/)
  @IsString()
  login: string;

  @MinLength(6)
  @MaxLength(20)
  @IsString()
  password: string;

  @Matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
  @IsString()
  email: string;
}
