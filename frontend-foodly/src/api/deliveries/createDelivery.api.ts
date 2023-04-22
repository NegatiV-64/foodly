import { fetchHandler } from '@/utils/fetch-hander.util';

export const createDelivery = async (body: CreateDeliveryBody) => {
    const response = await fetchHandler(
        '/deliveries',
        {
            method: 'POST',
            body: JSON.stringify(body)
        },
        {
            isAuth: true
        }
    );

    return response;
};

export interface CreateDeliveryBody {
    order_id: string;
    delivery_address: string;
    delivery_charge: number;
}