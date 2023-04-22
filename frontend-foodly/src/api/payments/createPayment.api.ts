import { fetchHandler } from '@/utils/fetch-hander.util';

export const createPayment = async (body: CreatePaymentBody) => {
    const response = await fetchHandler(
        '/payments',
        {
            method: 'POST',
            body: JSON.stringify(body),
        },
        {
            isAuth: true
        }
    );

    return response;
};

export interface CreatePaymentBody {
    order_id: string;
    payment_type: 'CASH' | 'CREDIT';
    payment_credit_card?: string;
}