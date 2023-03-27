import type { PipeTransform } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import type { GetDeliveriesSortByQueryParam } from '../interfaces';

@Injectable()
export class ValidateDeliverySortPipe implements PipeTransform {
    public transform(value: string | undefined): string | undefined {
        if (value === undefined) {
            return undefined;
        }

        if (typeof value !== 'string') {
            return undefined;
        }

        const sortPossibleValues: GetDeliveriesSortByQueryParam[] = [
            'delivery_created_at',
            'delivery_finished_at',
            'delivery_id',
            'delivery_price',
            'delivery_status',
        ];

        if (!sortPossibleValues.includes(value as GetDeliveriesSortByQueryParam)) {
            return undefined;
        }

        return value;
    }
}