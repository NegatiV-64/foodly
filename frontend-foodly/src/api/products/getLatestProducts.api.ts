import type { ProductList } from '@/types/product.types';
import { fetchHandler } from '@/utils/fetch-hander.util';

export const getLatestProducts = async () => {
    const response = await fetchHandler<GetLatestProductsResponse>('/products/popular', {
        method: 'GET',
    });

    return response;
};

interface GetLatestProductsResponse {
    products: ProductList;
}