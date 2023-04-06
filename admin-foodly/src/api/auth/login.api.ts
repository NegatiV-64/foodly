import { fetchHandler } from '@/utils/fetch-handler.util';

export async function login(body: LoginBody) {
    const response = await fetchHandler<LoginResponse>(
        '/auth/login/employee',
        {
            method: 'POST',
            body: JSON.stringify(body),
        },
        false
    );

    return response;
}

export interface LoginBody {
    email: string;
    password: string;
}

export interface LoginResponse {
    access_token: string;
    refresh_token: string;
}