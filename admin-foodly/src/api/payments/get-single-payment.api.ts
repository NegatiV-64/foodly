import type { Payment } from '@/interfaces/payment.interface';
import { fetchHandler } from '@/utils/fetch-handler.util';
import type { GetServerSidePropsContext } from 'next';

export const getSingePayment = async (paymentId: string, context: GetServerSidePropsContext) => {
    const response = await fetchHandler<GetSinglePaymentResponse>(
        `/payments/${paymentId}`,
        {
            method: 'GET',
        },
        true,
        true,
        context,
    );

    return response;
};

type GetSinglePaymentResponse = Pick<Payment, 'payment_id' | 'payment_date' | 'payment_type' | 'order' | 'user'>;