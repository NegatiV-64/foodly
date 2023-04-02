import type { Account } from '@/interfaces/account.interface';
import { fetchHandler } from '@/utils/fetchHander.util';

export const updateAccount = async (body: UpdateAccountBody) => {
    const response = await fetchHandler<Account>(
        '/account',
        {
            method: 'PATCH',
            body: JSON.stringify(body),
        },
        true,
    );

    return response;
};

export interface UpdateAccountBody {
    user_email?: string;
    user_phone?: string;
    user_old_password?: string;
    user_new_password?: string;
    user_address?: string;
    user_firstname?: string;
    user_lastname?: string;
}