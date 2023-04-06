import { amountToDisplay } from '@/config/pagination.config';
import type { Delivery } from '@/interfaces/delivery.interface';
import { fetchHandler } from '@/utils/fetch-handler.util';
import type { GetServerSidePropsContext } from 'next';

export const getDeliveries = async ({ order = 'asc', page = 1, sort = 'delivery_created_at', createdAt = '', customerId, status }: GetDeliveriesQueryParams, context: GetServerSidePropsContext) => {
    const skip = amountToDisplay * (page - 1);

    const response = await fetchHandler<GetDeliveriesResponse>(
        `/deliveries?take=${amountToDisplay}&skip=${skip}&customer_id=${customerId ?? ''}&created_at=${createdAt}&status=${status ?? ''}&sort=${sort}&order=${order}`,
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

export interface GetDeliveriesResponse {
    total: number;
    deliveries: Pick<Delivery, 'delivery_id' | 'delivery_boy' | 'delivery_status' | 'delivery_price' | 'delivery_address' | 'delivery_finished_at' | 'delivery_created_at'>[];
}