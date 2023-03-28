import { Injectable } from '@nestjs/common';
import type { PipeTransform } from '@nestjs/common';
import { PaymentType } from '@prisma/client';

@Injectable()
export class ValidatePaymentTypePipe implements PipeTransform {
    public transform(value: string | undefined) {
        if (value === undefined || typeof value !== 'string') {
            return undefined;
        }

        const type = value.toUpperCase();
        const possibleValues = Object.values(PaymentType) as string[];

        if (possibleValues.includes(type) === false) {
            return undefined;
        }

        return type;
    }

}