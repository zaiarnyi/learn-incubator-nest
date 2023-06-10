import { ApiProperty } from '@nestjs/swagger';

export class AuthBotLinkResponse {
  @ApiProperty({
    type: String,
    example: 'https://t.me/incubator_study_blBBot?stats=123123',
    nullable: false,
    required: true,
  })
  link: string;
}
