import type { Delivery } from '@/interfaces/delivery.interface';
import type { Order } from '@/interfaces/order.interface';
import type { Payment } from '@/interfaces/payment.interface';
import type { User } from '@/interfaces/user.interface';
import { fetchHandler } from '@/utils/fetch-handler.util';
import type { GetServerSidePropsContext } from 'next';

export const getSingleCustomer = async (customerId: number, context: GetServerSidePropsContext) => {
    const response = await fetchHandler<GetSingleCustomerResponse>(
        `/users/${customerId}`,
        {
            method: 'GET',
        },
        true,
        true,
        context,
    );

    return response;
};

export type GetSingleCustomerResponse = User & {
    orders: Pick<Order, 'order_id' | 'order_created_at' | 'order_price' | 'order_status'>[];
    deliveries: Pick<Delivery, 'delivery_id' | 'delivery_address' | 'delivery_created_at' | 'delivery_finished_at' | 'delivery_status' | 'delivery_price' | 'delivery_boy'>[];
    payments: (Pick<Payment, 'payment_id' | 'payment_type' | 'payment_date'> & { payment_order_id: string })[];
    feedbacks: {
        feedback_id: string;
        feedback_text: string;
        feedback_created_at: string;
    }[];
};