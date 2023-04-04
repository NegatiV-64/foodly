import type { Delivery } from './delivery.interface';
import type { Payment } from './payment.interface';
import type { Product } from './product.interface';
import type { User } from './user.interface';
import type { Nullable } from './utility.interface';

export interface Order {
    order_id: string;
    order_created_at: string;
    order_price: number;
    order_status: OrderStatus;
    order_user_id: number;
    order_payment_id: Nullable<string>;
    order_delivery_id: Nullable<string>;
    products: Product[];
    user: Pick<User, 'user_id' | 'user_firstname' | 'user_lastname' | 'user_email' | 'user_phone' | 'user_address' | 'user_type'>;
    delivery: Nullable<Omit<Delivery, 'order'>>;
    payment: Nullable<Pick<Payment, 'payment_id' | 'payment_date' | 'payment_type'>>;
}

export type OrderStatus = 'HOLD' | 'PAID' | 'CANCEL';