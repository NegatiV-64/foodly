export interface Account {
    user_address: string | null;
    user_email: string;
    user_firstname: string | null;
    user_id: number;
    user_is_verified: boolean;
    user_lastname: string | null;
    user_phone: string;
    user_type: string;
    delivery: unknown[];
    feedback: unknown[];
    order: unknown[];
    payment: unknown[];
}