import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { QueryBlogsRepository } from '../database/repositories/blogs/query-blogs.repository';

@ValidatorConstraint({ name: 'ValidateBlogById', async: true })
@Injectable()
export class ValidateBlogByIdValidator implements ValidatorConstraintInterface {
  constructor(private readonly queryRepository: QueryBlogsRepository) {}

  public async validate(val: any): Promise<boolean> {
    return this.queryRepository.getBlogById(val).then((res) => !!res);
  }

  public defaultMessage(): string {
    return `Unauthorized to execute this action`;
  }
}

export function ValidateBlogById(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: ValidateBlogByIdValidator,
    });
  };
}
