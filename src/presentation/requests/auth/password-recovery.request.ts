import { IsEmail, Matches } from 'class-validator';

export class CheckEmail {
  @IsEmail()
  @Matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
  email: string;
}
