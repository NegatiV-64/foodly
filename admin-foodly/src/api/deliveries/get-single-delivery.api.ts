import type { Delivery } from '@/interfaces/delivery.interface';
import { fetchHandler } from '@/utils/fetch-handler.util';
import type { GetServerSidePropsContext } from 'next';

export const getSingleDelivery = async (deliveryId: string, context: GetServerSidePropsContext) => {
    const response = await fetchHandler<GetSingleDeliveryResponse>(
        `/deliveries/${deliveryId}`,
        {
            method: 'GET',
        },
        true,
        true,
        context,
    );

    return response;
};

export type GetSingleDeliveryResponse = Delivery;