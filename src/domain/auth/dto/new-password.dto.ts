import { IsString, Length, Matches } from 'class-validator';

export class NewPasswordDto {
  @IsString()
  @Length(6, 20)
  newPassword: string;

  @IsString()
  @Matches(/[a-zA-Z0-9]{3}-[a-zA-Z0-9]{3}/)
  recoveryCode: string;
}
