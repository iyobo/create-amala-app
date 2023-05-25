import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator'

export function IsRequired(validationOptions?: ValidationOptions) {
  return (object: unknown, propertyName: string) => {
    registerDecorator({
      name: 'IsRequired',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate: (value: any): boolean => {
          if (typeof value === 'string') {
            return value.trim().length > 0
          } else {
            return !!value
          }
        },
        defaultMessage: (validationArguments?: ValidationArguments): string =>
          `${validationArguments.property} is Required`,
      },
    })
  }
}
