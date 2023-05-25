import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator'

type CustomValidatorParams = {
  name: string
  validator: (inputValue: unknown) => boolean | Promise<boolean>
  message?: string
  validationOptions?: ValidationOptions
}

export function IsCustom({ name, validationOptions, validator, message }: CustomValidatorParams) {
  return function (object: unknown, propertyName: string) {
    validationOptions = validationOptions || {}
    validationOptions.message = message || validationOptions.message || 'Not valid'

    registerDecorator({
      name: name || 'IsCustom',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return validator(value)
        },
      },
    })
  }
}
