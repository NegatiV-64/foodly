/* eslint-disable @typescript-eslint/ban-types */
import type { ValidationOptions, ValidationArguments } from 'class-validator';
import { registerDecorator } from 'class-validator';

export function IsNotEmptyString(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'isNotBlank',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value: unknown) {
                    return typeof value === 'string' && value.trim().length > 0;
                },
                defaultMessage(validationArguments?: ValidationArguments) {
                    const reason = validationArguments?.property ?? 'Given string';

                    return `${reason} is empty`;
                }
            },

        });
    };
}