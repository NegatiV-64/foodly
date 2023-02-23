import { ApiProperty } from '@nestjs/swagger';
import { UserRole, DeliveryStatus, OrderStatus, PaymentType } from '@prisma/client';

export class GetAccountDataResponse {
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

    @ApiProperty({ type: () => [Delivery] })
    delivery: Delivery[];

    @ApiProperty({ type: () => [Feedback] })
    feedback: Feedback[];

    @ApiProperty({ type: () => [Order] })
    order: Order[];

    @ApiProperty({ type: () => [Payment] })
    payment: Payment[];
}

class Delivery {
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

class Feedback {
    @ApiProperty()
    feedback_id: string;

    @ApiProperty()
    feedback_created_at: Date;

    @ApiProperty()
    feedback_user: number;

    @ApiProperty()
    feedback_text: string;
}

class Order {
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

class Payment {
    @ApiProperty()
    payment_id: string;

    @ApiProperty()
    payment_date: Date;

    @ApiProperty({ enum: OrderStatus })
    payment_type: PaymentType;

    @ApiProperty()
    payment_user_id: number;
}