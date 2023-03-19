import type { PipeTransform} from '@nestjs/common';
import { Injectable} from '@nestjs/common';
import type { OrderSort } from '../interfaces';
import { orderSortValues } from '../interfaces';

@Injectable()
export class ValidateOrderSortPipe implements PipeTransform {
    public transform(value: string | undefined) {
        if (value === undefined) {
            return undefined;
        }

        const sort = value.toLowerCase();

        if (orderSortValues.includes(sort as OrderSort) === false) {
            return undefined;
        }

        return sort;
    }
}
