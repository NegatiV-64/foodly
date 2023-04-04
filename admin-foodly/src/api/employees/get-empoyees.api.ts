import type { User, UserType } from '@/interfaces/user.interface';
import { fetchHandler } from '@/utils/fetch-handler.util';
import type { GetServerSidePropsContext } from 'next';

export async function getEmployees({ order = 'asc', page = 1, sort = 'user_id', type }: GetEmployeesQueryParams, context: GetServerSidePropsContext) {
    const take = 20;
    const skip = take * (page - 1);

    const response = await fetchHandler<GetEmployeesResponse>(
        `/employees?take=${take}&skip=${skip}&type=${type ?? ''}&order=${order}&sort=${sort}`,
        {
            method: 'GET',
        },
        true,
        true,
        context,
    );

    return response;
}

export interface GetEmployeesQueryParams {
    page?: number;
    type?: UserType;
    order?: 'asc' | 'desc';
    sort?: 'user_id' | 'user_firstname' | 'user_lastname' | 'user_email' | 'user_type';
}

export interface GetEmployeesResponse {
    total: number;
    employees: User[];
}