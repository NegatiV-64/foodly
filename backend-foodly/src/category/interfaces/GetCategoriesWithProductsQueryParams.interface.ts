import type { OrderByQuery } from 'src/shared/interfaces/queries.interface';

export interface GetCategoriesWithProductsQueryParams {
    order?: OrderByQuery;
    skip?: number;
    take?: number;
}