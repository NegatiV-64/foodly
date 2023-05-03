import { useQuery } from '@tanstack/react-query';
import { fetchHandler } from '../../utils/fetch-handler.util';
import type { Delivery } from '../../types/delivery.types';

export const getDeliveries = async () => {
    const response = await fetchHandler<GetDeliveriesResponse>(
        '/deliveries?order=desc&status=pending&sort=delivery_created_at',
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

export interface GetDeliveriesResponse {
    deliveries: Delivery[];
    total: number;
}

export const useGetOrders = () => {
    return useQuery({
        queryKey: ['get-deliveries'],
        queryFn: getDeliveries,
    });
};