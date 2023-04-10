import { amountToDisplay } from '@/config/pagination.config';
import type { User } from '@/interfaces/user.interface';
import { fetchHandler } from '@/utils/fetch-handler.util';
import type { GetServerSidePropsContext } from 'next';

export async function getEmployees({ order = 'desc', page, sort = 'user_id', type }: GetEmployeesQueryParams, context: GetServerSidePropsContext) {
    const skip = page ? (page - 1) * 10 : null;
    const take = page ? amountToDisplay : null;

    const response = await fetchHandler<GetEmployeesResponse>(
        `/users?role=${type ?? ''}&take=${take ?? ''}&skip=${skip ?? ''}&order=${order}&sort=${sort}`,
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
    search: string;
    type?: EmployeeTypeValue;
    order?: 'asc' | 'desc';
    sort?: EmployeeSortValue;
}

export const employeeSortValues = ['user_id', 'user_firstname', 'user_lastname', 'user_email', 'user_type'];
export type EmployeeSortValue = typeof employeeSortValues[number];
export const employeeTypeValues = ['admin', 'manager', 'delivery_boy'];
export type EmployeeTypeValue = typeof employeeTypeValues[number];

export interface GetEmployeesResponse {
    total: number;
    users: User[];
}