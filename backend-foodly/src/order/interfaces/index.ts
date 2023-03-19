import type { DeliveryStatus, OrderStatus, PaymentType, Product, UserRole } from '@prisma/client';
import type { Decimal } from '@prisma/client/runtime';
import type { OrderByQuery, Nullable } from 'src/shared/interfaces';

export type OrderSort = 'order_id' | 'order_price' | 'order_status' | 'order_created_at';
export const orderSortValues: OrderSort[] = ['order_id', 'order_price', 'order_status', 'order_created_at'];

export interface GetOrdersQueryParams {
    take?: number;
    skip?: number;
    userSearch?: string;
    created?: string;
    sort?: OrderSort;
    order?: OrderByQuery;
}

export interface GetOrderReturnType {
    order_id: string;
    order_created_at: Date;
    order_price: Decimal | number;
    order_status: OrderStatus;
    order_user_id: number;
    products: Array<Pick<Product, 'product_id' | 'product_description' | 'product_image' | 'product_name'> & { product_price: number | Decimal }>;
    user: {
        user_id: number;
        user_firstname: string | null;
        user_lastname: string | null;
        user_email: string;
        user_phone: string;
        user_address: string | null;
        user_type: UserRole;
    };
    payment: Nullable<{
        payment_id: string;
        payment_date: Date;
        payment_type: PaymentType;
    }>;
    delivery: Nullable<{
        delivery_address: string;
        delivery_date: Date | null;
        delivery_id: string;
        delivery_status: DeliveryStatus;
        delivery_price: Decimal | number;
        delivery_boy: Nullable<{
            user_id: number;
            user_firstname: string | null;
            user_lastname: string | null;
            user_phone: string;
        }>;
    }>;
}

export interface GetOrdersQueryParams {
    take?: number;
    skip?: number;
    userSearch?: string;
    created?: string;
    sort?: OrderSort;
    order?: OrderByQuery;
}

export interface CreateOrderReturnType {
    products: Product[];
    order_id: string;
    order_created_at: Date;
    order_price: Decimal;
    order_status: OrderStatus;
    order_user_id: number;
    order_payment_id: string | null;
    order_delivery_id: string | null;
}

export type UpdateOrderReturnType = GetOrderReturnType;