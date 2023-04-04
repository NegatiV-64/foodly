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

export interface DeleteSingleProductResponse {
    product_id: number;
    product_name: string;
    product_image: string;
    product_description: string;
    product_price: number;
    product_category_id: number;
}