import type { Nullable } from './utility.interface';

export type UserType = 'ADMIN' | 'MANAGER' | 'DELIVERY_BOY';

export interface User {
    user_id: number;
    user_firstname: Nullable<string>;
    user_lastname: Nullable<string>;
    user_email: string;
    user_phone: string;
    user_address: Nullable<string>;
    user_type: UserType;
}