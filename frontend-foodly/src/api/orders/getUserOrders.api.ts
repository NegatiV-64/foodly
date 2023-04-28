import { TAKE } from '@/config/pagination.config';
import type { Order } from '@/types/order.types';
import { fetchHandler } from '@/utils/fetch-hander.util';
import type { GetServerSidePropsContext } from 'next';

export const getUserOrders = async (page: number, context: GetServerSidePropsContext) => {
    const response = await fetchHandler<GetUserOrdersResponse>(
        `/orders?take=${TAKE}&skip=${TAKE * (page - 1)}&sort=order_created_at&order=desc`,
        {
            method: 'GET',
        },
        {
            isAuth: true,
            context,
        }
    );

    return response;
};

interface GetUserOrdersResponse {
    total: number;
    orders: Order[];
}