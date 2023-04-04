import { amountToDisplay } from '@/config/pagination.config';
import type { Payment, PaymentType } from '@/interfaces/payment.interface';
import { fetchHandler } from '@/utils/fetch-handler.util';
import type { GetServerSidePropsContext } from 'next';

export const getPayments = async ({ createdAt = '', order = 'asc', orderId = '', page = 1, payerId, type }: GetPaymentsQueryParams, context: GetServerSidePropsContext) => {
    const skip = amountToDisplay * (page - 1);

    const response = await fetchHandler<GetPaymentsResponse>(
        `/payments?take=${amountToDisplay}&skip=${skip}&order=${order}&created_at=${createdAt}}&type=${type ?? ''}&payer_id=${payerId ?? ''}&order_id=${orderId}`,
        {
            method: 'GET',
        },
        true,
        true,
        context,
    );

    return response;
};

export interface GetPaymentsQueryParams {
    page?: number;
    order?: 'asc' | 'desc';
    createdAt?: string;
    type?: PaymentType;
    payerId?: number;
    orderId?: string;
}

export interface GetPaymentsResponse {
    total: number;
    payments: Pick<Payment, 'payment_date' | 'payment_id' | 'payment_type' | 'payment_user_id' | 'payment_order_id'>[];
}