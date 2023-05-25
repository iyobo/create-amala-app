import {registerDecorator, ValidationArguments, ValidationOptions} from 'class-validator';

const timezoneValidator = require('timezone-validator');

export function IsTimezone(validationOptions?: ValidationOptions) {
  return function (object: unknown, propertyName: string) {

    validationOptions = validationOptions || {};
    validationOptions.message = validationOptions.message || "Not a timezone";

    registerDecorator({
      name: 'isTimezone',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          try {
            return timezoneValidator(value);
          } catch (err) {
            return false;
          }
        },
      },
    });
  };
}