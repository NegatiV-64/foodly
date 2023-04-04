import { fetchHandler } from '@/utils/fetch-handler.util';

export const updateSingleProduct = async (productId: number, body: UpdateSingleProductBody) => {
    const formData = new FormData();
    if (body.product_name) {
        formData.append('product_name', body.product_name);
    }

    if (body.product_description) {
        formData.append('product_description', body.product_description);
    }
    if (body.product_price) {
        formData.append('product_price', `${body.product_price}`);
    }

    if (body.product_image) {
        formData.append('product_image', body.product_image);
    }

    if (body.product_category_id) {
        formData.append('product_category_id', `${body.product_category_id}`);
    }

    const response = await fetchHandler<UpdateSingleProductResponse>(
        `/products/${productId}`,
        {
            method: 'PATCH',
            body: formData,
        },
        true,
        false,
    );

    return response;
};

export interface UpdateSingleProductBody {
    product_name?: string;
    product_description?: string;
    product_price?: number;
    product_image?: File;
    product_category_id?: number;
}

export interface UpdateSingleProductResponse {
    product_id: number;
    product_name: string;
    product_image: string;
    product_description: string;
    product_price: number;
    product_category_id: number;
}