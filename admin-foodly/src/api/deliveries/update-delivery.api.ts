import type { Nullable } from '@/interfaces/utility.interface';
import { fetchHandler } from '@/utils/fetch-handler.util';

export const updateSingleDelivery = async (deliveryId: string, body: UpdateSingleDeliveryBody) => {
    const response = await fetchHandler<UpdateSingleDeliveryResponse>(
        `/deliveries/${deliveryId}`,
        {
            method: 'PATCH',
            body: JSON.stringify(body),
        },
        true,
    );

    return response;
};

export interface UpdateSingleDeliveryBody {
    order_id?: string;
    delivery_address?: string;
    delivery_charge?: number;
    delivery_status?: 'ON_WAY' | 'DONE' | 'CANCELED' | 'FAILED' | 'PENDING';
    delivery_finished_at?: string;
    delivery_boy_id?: number;
}

export interface UpdateSingleDeliveryResponse {
    delivery_address: string;
    delivery_id: string;
    delivery_boy: Nullable<{
        user_id: number;
        user_firstname: Nullable<string>;
        user_lastname: Nullable<string>;
        user_phone: string;
    }>;
    // TODO add union type
    delivery_status: string;
    delivery_price: number;
    delivery_finished_at: Nullable<string>;
    delivery_created_at: string;
    order: {
        order_id: string;
        order_created_at: string;
        order_price: number;
        // TODO add union type
        order_status: string;
        payment: Nullable<{
            payment_id: string;
            payment_date: string;
            payment_type: string;
        }>;
        products: {
            product_id: number;
            product_name: string;
            product_price: number;
            product_description: string;
            product_image: string;
            amount: number;
        }[];
        user: {
            user_id: number;
            user_firstname: Nullable<string>;
            user_lastname: Nullable<string>;
            user_email: string;
            user_phone: string;
            user_address: Nullable<string>;
            user_type: string;
        };
    };
}