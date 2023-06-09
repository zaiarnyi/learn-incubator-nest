import { IsJWT, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginResponse {
  @ApiProperty({
    type: String,
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTIyMTksImlhdCI6MTY4MzYzOTQ4MSwiZXhwIjoxNzE0NzQzNDgxfQ.5j-jrsAzVlr_wO3U6aLxbxADQD8lsqxfJY1h1juuCmM',
  })
  @IsString()
  @IsJWT()
  accessToken: string;
}
