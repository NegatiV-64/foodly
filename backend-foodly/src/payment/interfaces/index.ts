import type { Payment, PaymentType } from '@prisma/client';
import type { OrderByQuery } from 'src/shared/interfaces';

export interface GetPaymentsQueryParams {
    take?: number;
    skip?: number;
    order?: OrderByQuery;
    created_at?: string;
    type?: PaymentType;
    payer_id?: number;
    order_id?: string;
    sort?: GetPaymentsQuerySortParam;
}

export type GetPaymentsQuerySortParam = 'delivery_id' | 'payment_date' | 'payment_type';

export interface GetPaymentsReturnType {
    payments: Pick<Payment, 'payment_date' | 'payment_id' | 'payment_order_id' | 'payment_type' | 'payment_user_id'>[];
    total: number;
}