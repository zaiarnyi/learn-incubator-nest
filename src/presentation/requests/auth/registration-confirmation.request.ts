import { IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegistrationConfirmationRequest {
  @ApiProperty({
    type: String,
    pattern: '[a-zA-Z0-9]{3}-[a-zA-Z0-9]{3}',
    nullable: false,
    required: true,
    example: 'ASD-ASD',
  })
  @IsString()
  @Matches(/[a-zA-Z0-9]{3}-[a-zA-Z0-9]{3}/)
  code: string;
}
