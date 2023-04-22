export type UserType = 'ADMIN' | 'MANAGER' | 'DELIVERY_BOY' | 'CUSTOMER';

export interface User {
    user_id: number;
    user_firstname: string;
    user_lastname: string;
    user_email: string;
    user_phone: string;
    user_address: string;
    user_type: UserType;
}