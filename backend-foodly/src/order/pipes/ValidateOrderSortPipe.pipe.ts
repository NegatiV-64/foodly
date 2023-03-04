import type { PipeTransform} from '@nestjs/common';
import { Injectable} from '@nestjs/common';
import type { OrderSort} from '../interfaces/OrderSort.interface';
import { orderSortValues } from '../interfaces/OrderSort.interface';

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
