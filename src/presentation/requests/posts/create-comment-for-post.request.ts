import { IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentForPostRequest {
  @Length(20, 300)
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String, example: 'some content', nullable: false, required: true })
  content: string;
}
