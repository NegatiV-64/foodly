import type { ProductList } from '@/interfaces/product.inteface';
import { fetchHandler } from '@/utils/fetchHander.util';

export const getPopularProducts = async () => {
    const response = await fetchHandler<GetPopularProductsResponse>('/products/popular', {
        method: 'GET',
    });

    return response;
};

interface GetPopularProductsResponse {
    products: ProductList;
}