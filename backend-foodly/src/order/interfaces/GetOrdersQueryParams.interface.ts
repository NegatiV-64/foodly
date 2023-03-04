import type { OrderByQuery } from 'src/shared/interfaces/queries.interface';
import type { OrderSort } from './OrderSort.interface';

export interface GetOrdersQueryParams {
    take?: number;
    skip?: number;
    userSearch?: string;
    created?: string;
    sort?: OrderSort;
    order?: OrderByQuery;
}