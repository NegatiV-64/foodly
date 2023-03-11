import { TAKE } from '@/config/pagination.config';
import type { ProductList } from '@/interfaces/product.inteface';
import { countSkip } from '@/utils/countSkip.util';
import { fetchHandler } from '@/utils/fetchHander.util';

export const getProductsByCategory = async (categorySlug: string, page: number) => {
    const skip = countSkip(page);

    const response = await fetchHandler<GetProductsByCategoryResponse>(
        `/products?category=${categorySlug}&take=${TAKE}&skip=${skip}`,
        {
            method: 'GET',
        });

    return response;
};

interface GetProductsByCategoryResponse {
    products: ProductList;
    total: number;
}