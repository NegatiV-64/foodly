import { fetchHandler } from '@/utils/fetch-handler.util';

export const deleteSingleDelivery = async (deliveryId: string) => {
    const response = await fetchHandler(
        `/deliveries/${deliveryId}`,
        {
            method: 'DELETE',
        },
        true,
    );

    return response;
};