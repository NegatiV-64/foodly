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

class GetPaymentUser {
    @ApiProperty()
    user_id: number;

    @ApiProperty()
    user_email: string;

    @ApiProperty()
    user_phone: string;

    @ApiProperty({ nullable: true, type: String })
    user_address: string | null;

    @ApiProperty({ nullable: true, type: String })
    user_firstname: string | null;

    @ApiProperty({ nullable: true, type: String })
    user_lastname: string | null;
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

    @ApiProperty({
        type: GetPaymentUser,
    })
    user: GetPaymentUser;
}