import type { Nullable } from '@/interfaces/utility.interface';
import { fetchHandler } from '@/utils/fetch-handler.util';
import type { GetServerSidePropsContext } from 'next';

export const getSingleOrder = async (orderId: string, context: GetServerSidePropsContext) => {
    const response = await fetchHandler<GetSingleOrderResponse>(
        `/orders/${orderId}`,
        {
            method: 'GET',
        },
        true,
        true,
        context,
    );

    return response;
};

interface GetSingleOrderResponse {
    order_id: string;
    order_created_at: Date;
    order_price: number;
    order_status: 'HOLD' | 'PAID' | 'CANCEL';
    order_user_id: number;
    order_payment_id: Nullable<string>;
    order_delivery_id: Nullable<string>;
    products: {
        product_id: number;
        product_name: string;
        product_price: number;
        product_description: string;
        product_image: string;
    }[];
    user: {
        user_id: number;
        user_firstname: Nullable<string>;
        user_lastname: Nullable<string>;
        user_email: string;
        user_phone: string;
        user_address: Nullable<string>;
        user_type: 'CUSTOMER' | 'ADMIN' | 'MANAGER' | 'DELIVERY_BOY';
    };
    delivery: Nullable<{
        delivery_id: string;
        delivery_boy: Nullable<{
            user_id: number;
            user_firstname: string;
            user_lastname: string;
            user_phone: string;
        }>;
        delivery_status: 'ON_WAY' | 'DONE' | 'CANCELED' | 'FAILED' | 'PENDING';
        delivery_price: number;
        delivery_address: string;
        delivery_finished_at: string;
        delivery_created_at: string;
    }>;
    payment: Nullable<{
        payment_id: string;
        payment_date: string;
        payment_type: string;
    }>;
}