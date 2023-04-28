import type { FullOrder } from '@/types/order.types';
import { fetchHandler } from '@/utils/fetch-hander.util';
import type { GetServerSidePropsContext } from 'next';

export const getSingleUserOrder = async (id: string, context: GetServerSidePropsContext) => {
    const response = await fetchHandler<FullOrder>(`/orders/${id}`, {
        method: 'GET',
    }, {
        isAuth: true,
        context,
    });

    return response;
};