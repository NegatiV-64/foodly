import type { Product } from '@/interfaces/product.interface';
import { fetchHandler } from '@/utils/fetch-handler.util';

export const getSingleProduct = async (productId: string) => {
    const response = await fetchHandler<GetSingleProductResponse>(
        `/products/${productId}`,
        {
            method: 'GET',
        },
    );

    return response;
};

type GetSingleProductResponse = Product;