import type { Account } from '@/interfaces/account.interface';
import { fetchHandler } from '@/utils/fetchHander.util';

export async function getAccount() {
    const response = await fetchHandler<Account>('/account', {
        method: 'GET',
    }, true);

    return response;
}