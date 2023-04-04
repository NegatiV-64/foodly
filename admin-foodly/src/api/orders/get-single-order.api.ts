import type { Order } from '@/interfaces/order.interface';
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

export type GetSingleOrderResponse = Order;