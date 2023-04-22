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
    order: {
        order_id: string;
        order_created_at: string;
        order_price: string;
        order_status: string;
        order_user_id: number;
        order_delivery_id: null;
    }[];
    payment: {
        payment_id: string;
        payment_date: string;
        payment_type: string;
        payment_user_id: number;
    }[];
}