import type { OrderByQuery } from 'src/shared/interfaces';

export interface GetCategoriesQueries {
    order?: OrderByQuery;
    take?: number;
    skip?: number;
}

export interface GetCategoriesWithProductsQueryParams {
    order?: OrderByQuery;
    skip?: number;
    take?: number;
}