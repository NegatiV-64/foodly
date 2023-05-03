import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Delivery } from '../../types/delivery.types';
import { fetchHandler } from '../../utils/fetch-handler.util';
import { ACCESS_TOKEN_KEY } from '../../config/auth.config';
import { decodeJwt } from '../../utils/decode-jwt.util';
import { ResponseError } from '../../exceptions/response-error.exception';
import type { AcccessTokenData } from '../../types/auth.types';
import { useQuery } from '@tanstack/react-query';

export const getUserDeliveries = async () => {
    try {
        const accessToken = await AsyncStorage.getItem(ACCESS_TOKEN_KEY);
        if (accessToken === null) {
            throw new ResponseError(401, false, null, 'Unauthorized');
        }

        const tokenData = decodeJwt<AcccessTokenData>(accessToken);
        if (!tokenData) {
            throw new ResponseError(401, false, null, 'Unauthorized');
        }

        const user_id = tokenData.user_id;

        const response = await fetchHandler<GetUserDeliveriesResponse>(
            `/deliveries/user/${user_id}?order=desc&sort=delivery_created_at`,
            {
                method: 'GET',
            },
            {
                isAuth: true,
                isJson: true,
            }
        );

        return response;
    } catch (error) {
        const errorData = null;
        let errorCode = 500;
        let errorMessage = 'Unknown Internal Server Error';

        if (error instanceof ResponseError) {
            errorCode = error.code;
            errorMessage = error.message;
        }

        return {
            ok: false,
            data: errorData,
            error: errorMessage,
            code: errorCode,
        };
    }
};

interface GetUserDeliveriesResponse {
    deliveries: Delivery[];
    total: number;
}

export const useGetUserDeliveriesQuery = () => {
    return useQuery({
        queryKey: ['get-user-deliveries'],
        queryFn: getUserDeliveries,
    });
};