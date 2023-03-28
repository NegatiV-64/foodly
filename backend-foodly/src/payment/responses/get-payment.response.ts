import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus, PaymentType } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime';

class GetPaymentOrder {
    @ApiProperty()
    order_id: string;

    @ApiProperty()
    order_created_at: Date;

    @ApiProperty({ type: Number })
    order_price: Decimal;

    @ApiProperty({
        enum: OrderStatus,
    })
    order_status: OrderStatus;
}

export class GetPaymentResponse {
    @ApiProperty({
        enum: PaymentType,
    })
    payment_type: PaymentType;

    @ApiProperty({
        type: GetPaymentOrder,
    })
    order: GetPaymentOrder;

    @ApiProperty()
    payment_date: Date;

    @ApiProperty()
    payment_id: string;
}