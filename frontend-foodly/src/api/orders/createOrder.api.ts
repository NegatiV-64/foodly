import { fetchHandler } from '@/utils/fetchHander.util';

export const createOrder = async (body: CreateOrderBody) => {
    const response = await fetchHandler('/orders', {
        method: 'POST',
        body: JSON.stringify(body),
    });

    return response;
};

interface CreateOrderBody {
    products: CreateOrderProduct[];
}

interface CreateOrderProduct {
    product_id: number;
    quantity: number;
}