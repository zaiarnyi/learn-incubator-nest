import { IsEmail, IsMongoId, IsString, Length, Matches } from 'class-validator';

export class MeResponse {
  @IsEmail()
  @Matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
  email: string;

  @IsString()
  @Length(3, 10)
  @Matches(/^[a-zA-Z0-9_-]*$/)
  login: string;

  @IsString()
  @IsMongoId()
  userId: string;
}
