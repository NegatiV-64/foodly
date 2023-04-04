import type { Nullable } from '@/interfaces/utility.interface';
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

/*
{
  "payment_type": "CASH",
  "order": {
    "order_id": "string",
    "order_created_at": "2023-04-04T15:34:03.443Z",
    "order_price": 0,
    "order_status": "HOLD"
  },
  "payment_date": "2023-04-04T15:34:03.443Z",
  "payment_id": "string"
}
*/

interface GetSinglePaymentResponse {
    payment_id: string;
    payment_date: string;
    payment_type: 'CASH' | 'CREDIT';
    order: {
        order_id: string;
        order_created_at: Date;
        order_price: number;
        order_status: 'HOLD' | 'PAID' | 'CANCEL';
    };
    user: {
        user_id: number;
        user_email: string;
        user_phone: string;
        user_address: Nullable<string>;
        user_firstname: Nullable<string>;
        user_lastname: Nullable<string>;
    };
}