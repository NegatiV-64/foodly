export interface Order {
    order_id: string;
    order_created_at: string;
    order_price: number;
    order_status: OrderStatus;
    order_user_id: number;
    order_delivery_id: string | null;
}

export type OrderStatus = 'HOLD' | 'PAID' | 'CANCEL' | 'DONE' | 'IN_PROGRESS';