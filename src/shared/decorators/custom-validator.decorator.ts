import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator'

export function Match(property: string, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'match', // tên rule
      target: object.constructor, // rule này thuộc class nào
      propertyName: propertyName, // field này được gắn decorator nào. VD: propertyName = "confirmPassword"
      constraints: [property], // tham số truyền vào decorator
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints
          const relatedValue = (args.object as any)[relatedPropertyName]
          return value === relatedValue
        },
        defaultMessage(args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints
          return `${args.property} is not match with ${relatedPropertyName}`
        },
      },
    })
  }
}
