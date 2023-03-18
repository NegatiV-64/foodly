import { fetchHandler } from '@/utils/fetchHander.util';

export const signIn = async (body: SignInBody) => {
    const response = await fetchHandler<SignInResponse>(
        '/auth/login',
        {
            method: 'POST',
            body: JSON.stringify(body),
        },
        false
    );

    return response;
};

interface SignInBody {
    email: string;
    password: string;
}

interface SignInResponse {
    access_token: string;
    refresh_token: string;
}