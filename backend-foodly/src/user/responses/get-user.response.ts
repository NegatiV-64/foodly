import { ApiProperty } from '@nestjs/swagger';
import { DeliveryStatus, OrderStatus, PaymentType, UserRole } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime';

export class GetUserDeliveryPerformed {
    @ApiProperty()
    delivery_id: string;

    @ApiProperty()
    delivery_address: string;

    @ApiProperty()
    delivery_created_at: Date;

    @ApiProperty({ nullable: true, type: Date })
    delivery_finished_at: Date | null;

    @ApiProperty({ type: Number })
    delivery_price: Decimal;

    @ApiProperty({ enum: DeliveryStatus })
    delivery_status: DeliveryStatus;

    @ApiProperty({ nullable: true, type: String })
    order_id: string | null;

    @ApiProperty({ nullable: true, type: Number })
    order_user_id: number | null;
}

class GetUserOrder {
    @ApiProperty()
    order_id: string;

    @ApiProperty()
    order_created_at: Date;

    @ApiProperty({ type: Number })
    order_price: Decimal;

    @ApiProperty({ enum: OrderStatus })
    order_status: OrderStatus;
}

class GetUserDeliveryBoy {
    @ApiProperty()
    user_id: number;

    @ApiProperty()
    user_phone: string;

    @ApiProperty({ nullable: true, type: String })
    user_firstname: string | null;

    @ApiProperty({ nullable: true, type: String })
    user_lastname: string | null;
}

class GetUserDelivery {
    @ApiProperty()
    delivery_id: string;

    @ApiProperty()
    delivery_address: string;

    @ApiProperty()
    delivery_created_at: Date;

    @ApiProperty({ nullable: true, type: Date })
    delivery_finished_at: Date | null;

    @ApiProperty({ type: Number })
    delivery_price: Decimal;

    @ApiProperty({ enum: DeliveryStatus })
    delivery_status: DeliveryStatus;

    @ApiProperty({ nullable: true, type: GetUserDeliveryBoy })
    delivery_boy: GetUserDeliveryBoy | null;
}


class GetUserPayment {
    @ApiProperty()
    payment_id: string;

    @ApiProperty()
    payment_date: Date;

    @ApiProperty({ enum: PaymentType })
    payment_type: PaymentType;

    @ApiProperty()
    payment_order_id: string;
}

class GetUserFeedback {
    @ApiProperty()
    feedback_id: string;

    @ApiProperty()
    feedback_text: string;

    @ApiProperty()
    feedback_created_at: Date;
}

export class GetUserResponse {
    @ApiProperty()
    user_id: number;

    @ApiProperty()
    user_email: string;

    @ApiProperty()
    user_phone: string;

    @ApiProperty({ enum: UserRole })
    user_type: UserRole;

    @ApiProperty({ nullable: true, type: String })
    user_firstname: string | null;

    @ApiProperty({ nullable: true, type: String })
    user_lastname: string | null;

    @ApiProperty()
    user_is_verified: boolean;

    @ApiProperty({ nullable: true, type: String })
    user_address: string | null;

    @ApiProperty({ type: [GetUserOrder] })
    orders: GetUserOrder[];

    @ApiProperty({ type: [GetUserDelivery] })
    deliveries: GetUserDelivery[];

    @ApiProperty({ type: [GetUserPayment] })
    payments: GetUserPayment[];

    @ApiProperty({ type: [GetUserDeliveryPerformed], nullable: true })
    deliveries_performed: GetUserDeliveryPerformed[] | null;

    @ApiProperty({ type: [GetUserFeedback] })
    feedbacks: GetUserFeedback[];
}