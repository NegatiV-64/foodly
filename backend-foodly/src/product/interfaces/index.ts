import type { OrderByQuery } from 'src/shared/interfaces';

export interface GetProductsQueryParams {
    take?: number;
    skip?: number;
    categorySlug?: string;
    search?: string;
    sort?: ProductSortQuery;
    order?: OrderByQuery;
}

export type ProductSortQuery = 'product_id' | 'product_name' | 'product_price' | 'category_name' | 'category_id';
export const productSortQuery: ProductSortQuery[] = ['product_id', 'product_name', 'product_price', 'category_name', 'category_id'];