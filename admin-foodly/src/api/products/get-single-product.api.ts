import type { Product } from '@/interfaces/product.interface';
import { fetchHandler } from '@/utils/fetch-handler.util';

export const getSingleProduct = async (productId: number) => {
    const response = await fetchHandler<GetSingleProductResponse>(
        `/products/${productId}`,
        {
            method: 'GET',
        },
    );

    return response;
};

type GetSingleProductResponse = Product;