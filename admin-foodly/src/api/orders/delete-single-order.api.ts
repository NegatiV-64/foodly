import { fetchHandler } from '@/utils/fetch-handler.util';

export const deleteSingleOrder = async (orderId: string) => {
    const response = await fetchHandler(
        `/orders/${orderId}`,
        {
            method: 'DELETE',
        },
        true,
    );

    return response;
};