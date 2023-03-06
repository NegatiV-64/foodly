import { fetchHandler } from '@/utils/fetchHander.util';

export const authRefresh = async (refreshToken: string) => {
    const response = await fetchHandler<AuthRefreshResponse>(
        '/auth/refresh',
        {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${refreshToken}`,
            }
        },
        false
    );

    return response;
};

interface AuthRefreshResponse {
    access_token: string;
    refresh_token: string;
}

