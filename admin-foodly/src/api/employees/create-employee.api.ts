import { fetchHandler } from '@/utils/fetch-handler.util';

export async function createEmployee(body: CreateEmployeeBody) {
    const response = await fetchHandler(
        '/employees',
        {
            method: 'POST',
            body: JSON.stringify(body),

        },
        true,
    );

    return response;
}

export interface CreateEmployeeBody {
    email: string;
    phone: string;
    password: string;
    first_name: string;
    last_name: string;
    type: 'ADMIN' | 'MANAGER' | 'DELIVERY_BOY';
}