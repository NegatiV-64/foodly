import type { ValidationOptions, ValidationArguments } from 'class-validator';
import { registerDecorator } from 'class-validator';
import { dayjs } from '../libs/dayjs.lib';

export function IsDateWithFormat(format?: 'string', validationOptions?: ValidationOptions) {
    // eslint-disable-next-line @typescript-eslint/ban-types
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'isDateWithFormat',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [format ?? 'DD-MM-YYYY'],
            options: {
                ...validationOptions,
                message: 'Date is not in correct format',
            },
            validator: {
                validate(value: unknown, args: ValidationArguments) {
                    const [dateFormat] = args.constraints;

                    if (typeof value !== 'string') {
                        return false;
                    }

                    if (typeof dateFormat !== 'string') {
                        return false;
                    }

                    const date = dayjs(value, dateFormat);

                    if (!date.isValid()) {
                        return false;
                    }

                    return true;
                }
            }
        });
    };

}