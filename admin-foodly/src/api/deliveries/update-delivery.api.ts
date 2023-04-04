import type { Delivery, DeliveryStatus } from '@/interfaces/delivery.interface';
import { fetchHandler } from '@/utils/fetch-handler.util';

export const updateSingleDelivery = async (deliveryId: string, body: UpdateSingleDeliveryBody) => {
    const response = await fetchHandler<UpdateSingleDeliveryResponse>(
        `/deliveries/${deliveryId}`,
        {
            method: 'PATCH',
            body: JSON.stringify(body),
        },
        true,
    );

    return response;
};

export interface UpdateSingleDeliveryBody {
    order_id?: string;
    delivery_address?: string;
    delivery_charge?: number;
    delivery_status?: DeliveryStatus;
    delivery_finished_at?: string;
    delivery_boy_id?: number;
}

export type UpdateSingleDeliveryResponse = Delivery;