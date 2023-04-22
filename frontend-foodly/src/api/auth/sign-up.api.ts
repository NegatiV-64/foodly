import { fetchHandler } from '@/utils/fetch-hander.util';

export const singUp = async (body: singUpBody) => {
    const response = await fetchHandler(
        '/auth/register',
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

interface singUpBody {
    email: string;
    phone: string;
    password: string;
}