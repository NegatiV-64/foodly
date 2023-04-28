import type { Product } from './product.types';
import type { User } from './user.types';

export interface Order {
    order_id: string;
    order_created_at: string;
    order_price: number;
    order_status: OrderStatus;
    order_user_id: number;
    order_delivery_id: string | null;
}

export type OrderStatus = 'HOLD' | 'PAID' | 'CANCEL';

export interface FullOrder extends Order {
    products: (Product & {
        amount: number;
    })[];
    delivery: {
        delivery_id: string;
        delivery_boy: Pick<User, 'user_id' | 'user_firstname' | 'user_lastname' | 'user_phone'>;
        delivery_status: 'ON_WAY' | 'DONE' | 'PENDING' | 'CANCELED' | 'FAILED';
        delivery_price: number;
        delivery_address: string;
        delivery_finished_at: string | null;
        delivery_created_at: string;
    } | null;
    payment: {
        payment_id: string;
        payment_date: string;
        payment_type: 'CASH' | 'CARD';
    } | null;
}