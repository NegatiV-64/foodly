import { TAKE } from '@/config/pagination.config';
import type { ProductList } from '@/types/product.types';
import { countSkip } from '@/utils/count-skip.util';
import { fetchHandler } from '@/utils/fetch-hander.util';

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