import type { OrderStatus } from './order.types';
import type { PaymentType } from './payment.types';
import type { Nullable } from './shared.types';
import type { UserType } from './user.types';

export interface Delivery {
    delivery_id: string;
    delivery_boy_id: string | null;
    delivery_boy: {
        user_id: string;
        user_firstname: string;
        user_lastname: string;
        user_phone: string;
    } | null;
    delivery_status: DeliveryStatus;
    delivery_price: number;
    delivery_address: string;
    delivery_finished_at: string | null;
    delivery_created_at: string;
    delivery_order_id: string;
}

export type DeliveryStatus = 'ON_WAY' | 'DONE' | 'PENDING' | 'CANCELED' | 'FAILED';

export interface FullDelivery extends Delivery {
    order: Nullable<{
        order_id: string;
        order_created_at: string;
        order_price: number;
        order_status: OrderStatus;
        payment: Nullable<{
            payment_id: string;
            payment_type: PaymentType;
            payment_created_at: string;
        }>;
        products: {
            amount: number;
            product_id: string;
            product_name: string;
            product_price: number;
            product_description: string;
            product_image: string;
        }[];
        user: Nullable<{
            user_id: string;
            user_firstname: Nullable<string>;
            user_lastname: Nullable<string>;
            user_email: string;
            user_phone: Nullable<string>;
            user_address: Nullable<string>;
            user_type: UserType;
        }>;
    }>;
}