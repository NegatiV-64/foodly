import type { PipeTransform } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import type { ProductSortQuery} from '../interfaces';
import { productSortQuery } from '../interfaces';

@Injectable()
export class ValidateProductSortQueryPipe implements PipeTransform {
    public transform(value: string): undefined | ProductSortQuery {
        if (productSortQuery.includes(value as ProductSortQuery)) {
            return value as ProductSortQuery;
        }

        return undefined;
    }
}