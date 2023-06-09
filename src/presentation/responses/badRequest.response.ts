import { ApiProperty } from '@nestjs/swagger';

class ErrorResponse {
  @ApiProperty()
  'message': string;

  @ApiProperty()
  'field': string;
}

export class BadRequestResponse {
  @ApiProperty({ description: 'If the inputModel has incorrect values', type: ErrorResponse, isArray: true })
  errorsMessages: ErrorResponse[];
}
