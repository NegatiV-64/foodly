import type { PipeTransform } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { DeliveryStatus } from '@prisma/client';

@Injectable()
export class ValidateDeliveryStatusPipe implements PipeTransform {
    public transform(value: string | undefined): DeliveryStatus | undefined {
        if (value === undefined) {
            return undefined;
        }

        if (typeof value !== 'string') {
            return undefined;
        }

        const status = value.toUpperCase();

        const statusPossibleValues = Object.values(DeliveryStatus) as string[];

        if (statusPossibleValues.includes(status) === false) {
            return undefined;
        }

        return status as DeliveryStatus;
    }
}