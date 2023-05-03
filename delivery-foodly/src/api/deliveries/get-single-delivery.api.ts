import { useQuery } from '@tanstack/react-query';
import type { FullDelivery } from '../../types/delivery.types';
import { fetchHandler } from '../../utils/fetch-handler.util';

const getSingleDelivery = async (deliveryId: string) => {
    const response = await fetchHandler<GetSingleDeliveryResponse>(
        `/deliveries/${deliveryId}`,
        {
            method: 'GET',
        },
        {
            isAuth: true,
            isJson: true,
        }
    );

    return response;
};

type GetSingleDeliveryResponse = FullDelivery;

export const useGetSingleDelivery = (deliveryId: string) => {
    return useQuery({
        queryKey: ['get-delivery', deliveryId],
        queryFn: () => getSingleDelivery(deliveryId),
    });
};