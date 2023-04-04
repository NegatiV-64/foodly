import type { Product } from '@/interfaces/product.interface';
import { fetchHandler } from '@/utils/fetch-handler.util';

export const deleteSingleProduct = async (productId: number) => {
    const response = await fetchHandler<DeleteSingleProductResponse>(
        `/products/${productId}`,
        {
            method: 'DELETE',
        },
        true,
    );

    return response;
};

export type DeleteSingleProductResponse =  Omit<Product, 'category'>;