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

interface GetSingleProductResponse {
    product_id: number;
    product_name: string;
    product_image: string;
    product_description: string;
    product_price: number;
    product_category_id: number;
    category: {
        category_id: number;
        category_icon: string;
        category_name: string;
        category_slug: string;
    };
}