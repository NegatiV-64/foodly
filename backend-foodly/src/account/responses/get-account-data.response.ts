import { ApiProperty } from '@nestjs/swagger';
import { UserRole, DeliveryStatus, OrderStatus, PaymentType } from '@prisma/client';

export class GetAccountResponse {
    @ApiProperty({ nullable: true })
    user_address: string;

    @ApiProperty()
    user_email: string;

    @ApiProperty({ nullable: true })
    user_firstname: string;

    @ApiProperty()
    user_id: number;

    @ApiProperty()
    user_is_verified: boolean;

    @ApiProperty({ nullable: true })
    user_lastname: string;

    @ApiProperty()
    user_phone: string;

    @ApiProperty({ enum: UserRole })
    user_type: UserRole;

    @ApiProperty({ type: () => [GetAccountDelivery] })
    delivery: GetAccountDelivery[];

    @ApiProperty({ type: () => [GetAccountFeedback] })
    feedback: GetAccountFeedback[];

    @ApiProperty({ type: () => [GetAccountOrder] })
    order: GetAccountOrder[];

    @ApiProperty({ type: () => [GetAccountPayment] })
    payment: GetAccountPayment[];
}

class GetAccountDelivery {
    @ApiProperty()
    delivery_id: string;

    @ApiProperty()
    delivery_boy: number;

    @ApiProperty({ enum: DeliveryStatus })
    delivery_status: DeliveryStatus;

    @ApiProperty()
    delivery_price: number;

    @ApiProperty()
    delivery_address: string;

    @ApiProperty({ nullable: true })
    delivery_date: Date;
}

class GetAccountFeedback {
    @ApiProperty()
    feedback_id: string;

    @ApiProperty()
    feedback_created_at: Date;

    @ApiProperty()
    feedback_user: number;

    @ApiProperty()
    feedback_text: string;
}

class GetAccountOrder {
    @ApiProperty()
    order_id: string;

    @ApiProperty()
    order_created_at: Date;

    @ApiProperty()
    order_price: number;

    @ApiProperty({ enum: OrderStatus })
    order_status: OrderStatus;

    @ApiProperty()
    order_user_id: number;

    @ApiProperty()
    order_payment_id: string;
}

class GetAccountPayment {
    @ApiProperty()
    payment_id: string;

    @ApiProperty()
    payment_date: Date;

    @ApiProperty({ enum: OrderStatus })
    payment_type: PaymentType;

    @ApiProperty()
    payment_user_id: number;
}