import { fetchHandler } from '@/utils/fetchHander.util';

export const createPayment = async (body: CreatePaymentBody) => {
    const response = await fetchHandler(
        '/payments',
        {
            method: 'POST',
            body: JSON.stringify(body),
        },
        true,
    );

    return response;
};

export interface CreatePaymentBody {
    order_id: string;
    payment_type: 'CASH' | 'CREDIT';
    payment_credit_card?: string;
}