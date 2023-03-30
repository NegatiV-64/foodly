export interface Account {
    user_address: string;
    user_email: string;
    user_firstname: string;
    user_id: number;
    user_is_verified: boolean;
    user_lastname: string;
    user_phone: string;
    user_type: string;
    delivery: unknown[];
    feedback: unknown[];
    order: unknown[];
    payment: unknown[];
}