import type { Nullable } from './shared.types';

export type UserType = 'CUSTOMER' | 'ADMIN' | 'MANAGER' | 'DELIVERY_BOY';

export interface User {
    user_address: Nullable<string>;
    user_email: string;
    user_firstname: Nullable<string>;
    user_id: number;
    user_is_verified: boolean;
    user_lastname: Nullable<string>;
    user_phone: string;
    user_type: UserType;
}