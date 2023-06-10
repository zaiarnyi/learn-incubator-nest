import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class MetaResponse {
  @Expose()
  @ApiProperty({ type: Number, example: 42, nullable: false })
  pagesCount: number;

  @Expose()
  @ApiProperty({ type: Number, example: 42, nullable: false })
  page: number;

  @Expose()
  @ApiProperty({ type: Number, example: 42, nullable: false })
  pageSize: number;

  @Expose()
  @ApiProperty({ type: Number, example: 42, nullable: false })
  totalCount: number;
}
