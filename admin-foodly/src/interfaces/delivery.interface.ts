import type { Order } from './order.interface';
import type { Product } from './product.interface';
import type { User } from './user.interface';
import type { Nullable } from './utility.interface';

export interface Delivery {
    delivery_address: string;
    delivery_id: string;
    delivery_boy: Nullable<Pick<User, 'user_id' | 'user_firstname' | 'user_lastname' | 'user_phone'>>;
    delivery_status: DeliveryStatus;
    delivery_price: number;
    delivery_finished_at: Nullable<string>;
    delivery_created_at: string;
    order: Pick<Order, 'order_id' | 'order_created_at' | 'order_price' | 'order_status' | 'payment' | 'user'> & {
        products: (Product & { amount: number })[];
    };
}

export type DeliveryStatus = 'ON_WAY' | 'DONE' | 'CANCELED' | 'FAILED' | 'PENDING';