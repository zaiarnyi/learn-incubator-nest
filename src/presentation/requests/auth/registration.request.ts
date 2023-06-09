import { IsEmail, IsString, Length, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegistrationRequest {
  @ApiProperty({
    type: String,
    minLength: 3,
    maxLength: 10,
    pattern: '^[a-zA-Z0-9_-]*$',
    nullable: false,
    required: true,
  })
  @IsString()
  @Length(3, 10)
  @Matches(/^[a-zA-Z0-9_-]*$/)
  login: string;

  @IsString()
  @Length(6, 20)
  @ApiProperty({
    type: String,
    minLength: 6,
    maxLength: 20,
    nullable: false,
    required: true,
  })
  password: string;

  @ApiProperty({
    type: String,
    pattern: '^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$',
    nullable: false,
    required: true,
    example: 'x@x.com',
  })
  @IsEmail()
  @Matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
  email: string;
}
