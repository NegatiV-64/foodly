import type { Order } from './order.interface';
import type { User } from './user.interface';

export interface Payment {
    payment_type: PaymentType;
    payment_id: string;
    payment_date: string;
    payment_order_id: string;
    payment_user_id: number;
    order: Pick<Order, 'order_id' | 'order_created_at' | 'order_price' | 'order_status'>;
    user: Pick<User, 'user_id' | 'user_email' | 'user_phone' | 'user_address' | 'user_firstname' | 'user_lastname'>;
}

export type PaymentType = 'CASH' | 'CARD';