import { TAKE } from '@/config/pagination.config';
import type { Product } from '@/types/product.types';
import { fetchHandler } from '@/utils/fetch-hander.util';

export const getProducts = async ({ page, search }: GetProductsQueryParams) => {
    const resposne = await fetchHandler<GetProductsResponse>(
        `/products?take=${TAKE}&skip=${(page - 1) * TAKE}&search=${search ?? ''}&sort=product_id&order=desc`,
        {
            method: 'GET',
        },
        false, true
    );

    return resposne;
};

export interface GetProductsQueryParams {
    page: number;
    search?: string | null;
}

export interface GetProductsResponse {
    products: Product[];
    total: number;
}