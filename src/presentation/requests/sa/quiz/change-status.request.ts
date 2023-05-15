import { IsBoolean, IsEnum, IsNotEmpty, ValidateNested } from 'class-validator';
import { Transform } from 'class-transformer';

export class ChangeStatusRequest {
  @IsNotEmpty()
  @IsBoolean()
  @Transform(({ value }) => {
    if (typeof value !== 'boolean') {
      return '1';
    }
    return value;
  })
  published: any;
}
