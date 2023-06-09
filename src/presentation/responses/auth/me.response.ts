import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class MeResponse {
  @ApiProperty({ example: 'x@x.com' })
  @Expose()
  email: string;

  @Expose()
  @ApiProperty({ example: 'kozhaniy' })
  login: string;

  @Expose()
  @ApiProperty({ example: '42', type: String })
  userId: string;
}
