import type { UseMutationOptions} from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';
import type { DeliveryStatus, FullDelivery } from '../../types/delivery.types';
import type { FetchHandler} from '../../utils/fetch-handler.util';
import { fetchHandler } from '../../utils/fetch-handler.util';

export const updateDelivery = async (deliveryId: string, body: UpdateDeliveryBody) => {
    const response = await fetchHandler<FullDelivery>(
        `/deliveries/${deliveryId}`,
        {
            method: 'PATCH',
            body: JSON.stringify(body)
        },
        {
            isAuth: true
        }
    );

    return response;
};

export const useUpdateDelivery = (deliveryId: string, body: UpdateDeliveryBody, mutationOptions?: UpdateDeliveryMutationOptions) => {
    return useMutation({
        mutationKey: ['update-delivery', deliveryId],
        mutationFn: () => updateDelivery(deliveryId, body),
        ...mutationOptions
    });
};

interface UpdateDeliveryBody {
    delivery_status: DeliveryStatus;
    delivery_boy_id?: number;
}

type UpdateDeliveryMutationOptions = Omit<UseMutationOptions<FetchHandler<FullDelivery, unknown>, unknown, void, unknown>, 'mutationKey' | 'mutationFn'>;