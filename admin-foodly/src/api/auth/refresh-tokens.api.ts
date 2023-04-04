import { fetchHandler } from '@/utils/fetch-handler.util';

export async function refreshTokens(refreshToken: string) {
    const response = await fetchHandler<RefreshTokensResponse>(
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
}

interface RefreshTokensResponse {
    access_token: string;
    refresh_token: string;
}
