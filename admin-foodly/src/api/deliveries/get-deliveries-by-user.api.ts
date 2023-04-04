import { amountToDisplay } from '@/config/pagination.config';
import { fetchHandler } from '@/utils/fetch-handler.util';
import type { GetServerSidePropsContext } from 'next';

export const getDeliveriesByUser = async (userId: string, { createdAt = '', order = 'asc', page = 1, sort = 'delivery_created_at', status }: GetDeliveriesByUserQueryParams, context: GetServerSidePropsContext) => {
    const skip = amountToDisplay * (page - 1);

    const response = await fetchHandler(
        `/deliveries/user/${userId}?take=${amountToDisplay}&skip=${skip}&createdAt=${createdAt}&status=${status ?? ''}&sort=${sort}&order=${order}`,
        {
            method: 'GET',
        },
        true,
        true,
        context,
    );

    return response;
};

interface GetDeliveriesByUserQueryParams {
    page?: number;
    order?: 'asc' | 'desc';
    createdAt?: string;
    status?: 'on_way' | 'done' | 'canceled' | 'failed' | 'pending';
    sort?: 'delivery_id' | 'delivery_created_at' | 'delivery_finished_at' | 'delivery_price' | 'delivery_status';
}