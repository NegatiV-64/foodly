import { fetchHandler } from '@/utils/fetch-hander.util';

export const authRefresh = async (refreshToken: string) => {
    const response = await fetchHandler<AuthRefreshResponse>(
        '/auth/refresh',
        {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${refreshToken}`,
            }
        },
        {
            isAuth: false,
        }
    );

    return response;
};

interface AuthRefreshResponse {
    access_token: string;
    refresh_token: string;
}

