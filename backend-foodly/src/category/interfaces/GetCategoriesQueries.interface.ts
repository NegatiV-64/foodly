import type { OrderByQuery } from 'src/shared/interfaces/queries.interface';

export interface GetCategoriesQueries {
    order?: OrderByQuery;
    take?: number;
    skip?: number;
}