import { amountToDisplay } from '@/config/pagination.config';
import type { Order } from '@/interfaces/order.interface';
import { fetchHandler } from '@/utils/fetch-handler.util';
import type { GetServerSidePropsContext } from 'next';

export const getOrders = async ({ order = 'asc', page = 1, sort = 'order_created_at', user = '', }: GetOrdersQueryParams, context: GetServerSidePropsContext) => {
    const skip = amountToDisplay * (page - 1);

    const response = await fetchHandler<GetOrdersResponse>(
        `/orders?take=${amountToDisplay}&skip=${skip}&user=${user}&sort=${sort}&order=${order}`,
        {
            method: 'GET',
        },
        true,
        true,
        context,
    );

    return response;
};

export interface GetOrdersQueryParams {
    page?: number;
    user?: string;
    sort?: 'order_id' | 'order_price' | 'order_status' | 'order_created_at';
    order?: 'asc' | 'desc';
}

export interface GetOrdersResponse {
    total: number;
    orders: Pick<Order, 'order_id' | 'order_created_at' | 'order_price' | 'order_status' | 'order_user_id' | 'order_delivery_id'>[];
}

