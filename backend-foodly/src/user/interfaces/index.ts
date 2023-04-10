import type { UserRole } from '@prisma/client';
import type { OrderByQuery } from 'src/shared/interfaces';

export type UserSortValue = 'user_id' | 'user_email' | 'user_type' | 'user_lastname';

export interface GetUsersQueryParams {
    take?: number;
    skip?: number;
    search?: string;
    order?: OrderByQuery;
    role?: UserRole;
    sort?: UserSortValue;
}