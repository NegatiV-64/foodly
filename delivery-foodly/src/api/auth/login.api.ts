import { fetchHandler } from '../../utils/fetch-handler.util';

export const login = async (body: LoginBody) => {
    const response = await fetchHandler<LoginResponse>(
        '/auth/login',
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

export interface LoginBody {
    email: string;
    password: string;
}

interface LoginResponse {
    access_token: string;
    refresh_token: string;
}