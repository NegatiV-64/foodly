import type { OrderByQuery } from 'src/shared/interfaces/queries.interface';
import type { ProductSortQuery } from './ProductSortQuery.interface';

export interface GetProductsQueryParams {
    take?: number;
    skip?: number;
    categorySlug?: string;
    search?: string;
    sort?: ProductSortQuery;
    order?: OrderByQuery;
}