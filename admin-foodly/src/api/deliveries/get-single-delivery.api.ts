import type { Nullable } from '@/interfaces/utility.interface';
import { fetchHandler } from '@/utils/fetch-handler.util';
import type { GetServerSidePropsContext } from 'next';

export const getSingleDelivery = async (deliveryId: string, context: GetServerSidePropsContext) => {
    const response = await fetchHandler<GetSingleDeliveryResponse>(
        `/deliveries/${deliveryId}`,
        {
            method: 'GET',
        },
        true,
        true,
        context,
    );

    return response;
};

export interface GetSingleDeliveryResponse {
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
