import { ApiProperty } from '@nestjs/swagger';
import { PaymentType } from '@prisma/client';
import type { GetPaymentsReturnType } from '../interfaces';

class GetPaymentsPayment {
    @ApiProperty()
    payment_date: Date;

    @ApiProperty()
    payment_id: string;

    @ApiProperty()
    payment_order_id: string;

    @ApiProperty({ enum: PaymentType })
    payment_type: PaymentType;

    @ApiProperty()
    payment_user_id: number;
}

export class GetPaymentsResponse implements GetPaymentsReturnType {
    payments: GetPaymentsPayment[];

    @ApiProperty()
    total: number;
}