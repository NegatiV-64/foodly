import type { DeliveryStatus, OrderStatus, PaymentType, UserRole } from '@prisma/client';
import type { Nullable, OrderByQuery } from 'src/shared/interfaces';
import type { Decimal } from '@prisma/client/runtime';

export interface GetDeliveriesQueryParams {
    take?: number;
    skip?: number;
    status?: DeliveryStatus;
    customer_id?: number;
    order?: OrderByQuery;
    created_at?: string;
    sort?: GetDeliveriesSortByQueryParam;
}

export type GetDeliveriesSortByQueryParam = 'delivery_id' | 'delivery_created_at' | 'delivery_finished_at' | 'delivery_price' | 'delivery_status';

export interface GetDeliveriesOfUserQueryParams {
    take?: number;
    skip?: number;
    status?: DeliveryStatus;
    order?: OrderByQuery;
    created_at?: string;
    sort?: GetDeliveriesSortByQueryParam;
}

export interface GetDeliveryByIdReturnType {
    delivery_id: string;
    delivery_boy: Nullable<{
        user_id: number;
        user_phone: string;
        user_firstname: string | null;
        user_lastname: string | null;
    }>;
    delivery_status: DeliveryStatus;
    delivery_price: Decimal | number;
    delivery_address: string;
    delivery_finished_at: Date | null;
    delivery_created_at: Date;
    order: Nullable<{
        order_id: string;
        order_created_at: Date;
        order_price: Decimal | number;
        order_status: OrderStatus;
        payment: Nullable<{
            payment_id: string;
            payment_date: Date;
            payment_type: PaymentType;
        }>;
        products: Array<{
            amount: number;
            product_id: number;
            product_name: string;
            product_image: string;
            product_description: string;
            product_price: Decimal | number;
        }>;
        user: {
            user_id: number;
            user_type: UserRole;
            user_email: string;
            user_phone: string;
            user_address: string | null;
            user_firstname: string | null;
            user_lastname: string | null;
        };
    }>;
}

export type UpdateDeliveryByIdReturnType = GetDeliveryByIdReturnType;