import { ApiProperty } from '@nestjs/swagger';
import { DeliveryStatus, OrderStatus, PaymentType, UserRole } from '@prisma/client';
import type { GetOrderReturnType } from '../interfaces';

class GetOrderProduct {
    @ApiProperty()
    product_id: number;

    @ApiProperty()
    product_name: string;

    @ApiProperty()
    product_price: number;

    @ApiProperty()
    product_description: string;

    @ApiProperty()
    product_image: string;
}

class GetOrderUser {
    @ApiProperty()
    user_id: number;

    @ApiProperty({ nullable: true })
    user_firstname: string;

    @ApiProperty({ nullable: true })
    user_lastname: string;

    @ApiProperty()
    user_email: string;

    @ApiProperty({ nullable: true })

    user_phone: string;

    @ApiProperty({ nullable: true })
    user_address: string;

    @ApiProperty({ enum: UserRole })
    user_type: UserRole;
}

class GetOrderDeliveryBody {
    @ApiProperty()
    user_id: number;

    @ApiProperty({ nullable: true })
    user_firstname: string;

    @ApiProperty({ nullable: true })
    user_lastname: string;

    @ApiProperty({ nullable: true })
    user_phone: string;
}

class GetOrderDelivery {
    @ApiProperty()
    delivery_id: string;

    @ApiProperty()
    delivery_address: string;

    @ApiProperty({ enum: DeliveryStatus })
    delivery_status: DeliveryStatus;

    @ApiProperty({ nullable: true })
    delivery_date: Date;

    @ApiProperty()
    delivery_price: number;

    @ApiProperty({ type: GetOrderDeliveryBody, nullable: true })
    delivery_boy: GetOrderDeliveryBody;
}

class GetOrderPayment {
    @ApiProperty()
    payment_id: string;

    @ApiProperty()
    payment_date: Date;

    @ApiProperty({ enum: PaymentType })
    payment_type: PaymentType;
}

export class GetOrderResponse implements GetOrderReturnType {
    @ApiProperty()
    order_id: string;

    @ApiProperty()
    order_created_at: Date;

    @ApiProperty()
    order_price: number;

    @ApiProperty()
    order_status: OrderStatus;

    @ApiProperty()
    order_user_id: number;

    @ApiProperty({ nullable: true })
    order_payment_id: string;

    @ApiProperty({ nullable: true })
    order_delivery_id: string;

    @ApiProperty({ type: [GetOrderProduct] })
    products: GetOrderProduct[];

    @ApiProperty({ type: GetOrderUser })
    user: GetOrderUser;

    @ApiProperty({ nullable: true, type: GetOrderDelivery })
    delivery: GetOrderDelivery;

    @ApiProperty({ nullable: true, type: GetOrderPayment })
    payment: GetOrderPayment;
}