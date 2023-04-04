import { amountToDisplay } from '@/config/pagination.config';
import { fetchHandler } from '@/utils/fetch-handler.util';
import type { GetServerSidePropsContext } from 'next';

export const getDeliveries = async ({ order = 'asc', page = 1, sort = 'delivery_created_at', createdAt = '', customerId, status }: GetDeliveriesQueryParams, context: GetServerSidePropsContext) => {
    const skip = amountToDisplay * (page - 1);

    const response = await fetchHandler(
        `/deliveries?take=${amountToDisplay}&skip=${skip}&customer_id=${customerId ?? ''}&createdAt=${createdAt}&status=${status ?? ''}&sort=${sort}&order=${order}`,
        {
            method: 'GET',
        },
        true,
        true,
        context,
    );

    return response;
};

export interface GetDeliveriesQueryParams {
    page?: number;
    order?: 'asc' | 'desc';
    customerId?: number;
    createdAt?: string;
    status?: 'on_way' | 'done' | 'canceled' | 'failed' | 'pending';
    sort?: 'delivery_id' | 'delivery_created_at' | 'delivery_finished_at' | 'delivery_price' | 'delivery_status';
}
