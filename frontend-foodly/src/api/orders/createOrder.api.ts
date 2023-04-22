import type { Product } from '@/types/product.types';
import { fetchHandler } from '@/utils/fetch-hander.util';

export const createOrder = async (body: CreateOrderBody) => {
    const response = await fetchHandler<CreateOrderResponse>('/orders',
        {
            method: 'POST',
            body: JSON.stringify(body),
        },
        {
            isAuth: true
        }
    );

    return response;
};

export interface CreateOrderBody {
    products: CreateOrderProduct[];
}

export interface CreateOrderProduct {
    product_id: number;
    quantity: number;
}

export interface CreateOrderResponse {
    order_id: string;
    order_created_at: string;
    order_price: number;
    order_status: string;
    order_user_id: number;
    order_payment_id: string;
    order_delivery_id: string;
    order_products: Array<Omit<Product, 'product_category_id' | 'category'>>;
}