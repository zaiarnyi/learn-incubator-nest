import { PublishedStatusEnum } from '../../../../domain/sa/quiz/enums/published-status.enum';
import { IsEnum, IsInt, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class GetQuestionsParamsRequest {
  @IsString()
  @IsOptional()
  bodySearchTerm: string;

  @IsOptional()
  @IsEnum(PublishedStatusEnum)
  publishedStatus = PublishedStatusEnum.ALL;

  @IsString()
  @IsOptional()
  sortBy = 'createdAt';

  @IsString()
  @IsOptional()
  @IsEnum(['ASC', 'DESC'])
  @Transform(({ value }) => value && value.toUpperCase())
  sortDirection: 'ASC' | 'DESC' = 'DESC';

  @IsOptional()
  @IsNumber()
  @Min(1)
  pageNumber = 1;

  @IsOptional()
  @Transform(({ value }) => value && parseInt(value, 10))
  @IsInt()
  @Max(100)
  pageSize = 10;
}
