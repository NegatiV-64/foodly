import { fetchHandler } from '@/utils/fetch-handler.util';

export const updateSingleCustomer = async (customerId: number, body: UpdateSingleCustomerBody) => {
    const response = await fetchHandler(
        `/users/${customerId}`,
        {
            method: 'PATCH',
            body: JSON.stringify(body),
        },
        true,
    );

    return response;
};

export type UpdateSingleCustomerBody = Partial<{
    email: string;
    phone: string;
    firstname: string;
    lastname: string;
    password: string;
    address: string;
    role: string;
    is_verified: boolean;
}>;