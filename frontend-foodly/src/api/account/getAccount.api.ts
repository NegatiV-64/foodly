import type { Account } from '@/types/account.types';
import { fetchHandler } from '@/utils/fetch-hander.util';
import type { GetServerSidePropsContext } from 'next';

export async function getAccount(context?: GetServerSidePropsContext) {
    const response = await fetchHandler<Account>(
        '/account',
        {
            method: 'GET',
        },
        {
            context: context,
            isAuth: true,
        }
    );

    return response;
}