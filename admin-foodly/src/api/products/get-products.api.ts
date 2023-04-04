import { amountToDisplay } from '@/config/pagination.config';
import type { Product } from '@/interfaces/product.interface';
import { fetchHandler } from '@/utils/fetch-handler.util';

export const getProducts = async ({ page = 1, category, order = 'asc', search = '', sort = 'product_id' }: GetProductsQueryParams) => {
    const skip = amountToDisplay * (page - 1);

    const response = await fetchHandler<GetProductsResponse>(
        `/products?take=${amountToDisplay}&skip=${skip}&category=${category ?? ''}&search=${search}&sort=${sort}&order=${order}`,
        {
            method: 'GET',
        },
    );

    return response;
};

interface GetProductsQueryParams {
    page?: number;
    category?: number;
    search?: string;
    sort?: 'product_id' | 'product_name' | 'product_price' | 'category_name' | 'category_id';
    order?: 'asc' | 'desc';
}

interface GetProductsResponse {
    total: number;
    products: Product[];
}