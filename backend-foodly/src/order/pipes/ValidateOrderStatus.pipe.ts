import type { PipeTransform } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class ValidateOrderStatusPipe implements PipeTransform {
    public transform(value: unknown) {
        if (typeof value !== 'string') {
            return undefined;
        }

        const validStatuses = Object.values(OrderStatus);

        if (!validStatuses.includes(value as OrderStatus)) {
            return undefined;
        }

        return value;
    }
}