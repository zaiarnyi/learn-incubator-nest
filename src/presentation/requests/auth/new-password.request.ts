import { IsString, Length, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class NewPasswordRequest {
  @ApiProperty({ example: '1234567', nullable: false, required: true, maxLength: 20, minLength: 6, type: String })
  @IsString()
  @Length(6, 20)
  newPassword: string;

  @IsString()
  @Matches(/[a-zA-Z0-9]{3}-[a-zA-Z0-9]{3}/)
  @ApiProperty({
    example: 'ASD-ASD',
    type: String,
    required: true,
    nullable: false,
    pattern: '[a-zA-Z0-9]{3}-[a-zA-Z0-9]{3}',
  })
  recoveryCode: string;
}
