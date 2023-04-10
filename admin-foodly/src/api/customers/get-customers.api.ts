import { amountToDisplay } from '@/config/pagination.config';
import type { User } from '@/interfaces/user.interface';
import { fetchHandler } from '@/utils/fetch-handler.util';
import type { GetServerSidePropsContext } from 'next';

export const getCustomers = async ({ order = 'desc', page = 1, search, sort = 'user_id' }: GetCustomersQueryParams, context: GetServerSidePropsContext) => {
    const skip = (page - 1) * amountToDisplay;

    const response = await fetchHandler<GetCustomersResponse>(
        `/users?role=customer&take=${amountToDisplay}&skip=${skip}&order=${order}&search=${search}&sort=${sort}`,
        {
            method: 'GET',
        },
        true,
        true,
        context,
    );

    return response;
};

export interface GetCustomersQueryParams {
    page?: number;
    search?: string;
    order?: 'asc' | 'desc';
    sort?: 'user_id' | 'user_email' | 'user_lastname';
}

export interface GetCustomersResponse {
    users: User[];
    total: number;
}