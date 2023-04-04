import type { Product } from '@/interfaces/product.interface';
import { fetchHandler } from '@/utils/fetch-handler.util';

export const createProduct = async (body: CreateProductBody) => {
    const formData = new FormData();
    formData.append('product_name', body.product_name);
    formData.append('product_description', body.product_description);
    formData.append('product_price', `${body.product_price}`);
    formData.append('product_image', body.product_image);
    formData.append('product_category_id', `${body.product_category_id}`);

    const response = await fetchHandler<CreateProductResponse>(
        '/products',
        {

            method: 'POST',
            body: formData,
        },
        true,
        false,
    );

    return response;
};

export interface CreateProductBody {
    product_name: string;
    product_description: string;
    product_price: number;
    product_image: File;
    product_category_id: number;
}

export type CreateProductResponse = Omit<Product, 'category'>;