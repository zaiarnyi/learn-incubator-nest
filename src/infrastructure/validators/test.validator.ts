import { isURL, registerDecorator, ValidationOptions } from 'class-validator';

export function IsValidLink(validationOptions?: ValidationOptions) {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsValidLink',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: unknown) {
          const array = Object.entries(value);

          for (const item of array) {
            const link = item[1].link;

            if (!link) {
              return false;
            }
            if (typeof link !== 'string') {
              return false;
            }

            if (link.length < 2) {
              return false;
            }

            if (!isURL(link)) {
              return false;
            }
          }
          return true;
        },
        defaultMessage() {
          return `${propertyName} has not valid link`;
        },
      },
    });
  };
}
