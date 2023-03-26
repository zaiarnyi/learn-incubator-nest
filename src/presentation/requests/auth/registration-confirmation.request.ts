import { IsString, Matches } from 'class-validator';

export class RegistrationConfirmationRequest {
  @IsString()
  @Matches(/[a-zA-Z0-9]{3}-[a-zA-Z0-9]{3}/)
  code: string;
}
