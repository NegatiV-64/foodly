import { fetchHandler } from '@/utils/fetch-hander.util';

export const verify = async (body: VerifyBody) => {
    const response = await fetchHandler(
        '/auth/verify',
        {
            method: 'POST',
            body: JSON.stringify(body),
        },
        {
            isAuth: false,
        }
    );

    return response;
};

export interface VerifyBody {
    email: string;
    verification_code: string;
}