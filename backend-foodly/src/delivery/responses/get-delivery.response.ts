import { ApiProperty } from '@nestjs/swagger';
import { DeliveryStatus, OrderStatus, PaymentType, UserRole } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime';
import type { GetDeliveryByIdReturnType } from '../interfaces';

class GetDeliveryOrderPayment {
    @ApiProperty()
    payment_id: string;

    @ApiProperty()
    payment_date: Date;

    @ApiProperty({ enum: PaymentType })
    payment_type: PaymentType;
}

class GetDeliveryOrderProduct {
    @ApiProperty()
    amount: number;

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

class GetDeliveryOrderUser {
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

class GetDeliveryOrder {
    @ApiProperty()
    order_id: string;

    @ApiProperty()
    order_created_at: Date;

    @ApiProperty()
    order_price: number;

    @ApiProperty({ enum: OrderStatus })
    order_status: OrderStatus;

    @ApiProperty({ type: GetDeliveryOrderPayment, nullable: true })
    payment: GetDeliveryOrderPayment;

    @ApiProperty({ type: [GetDeliveryOrderProduct] })
    products: GetDeliveryOrderProduct[];

    @ApiProperty({ type: GetDeliveryOrderUser, nullable: true })
    user: GetDeliveryOrderUser;
}

class GetDeliveryDeliveryBoy {
    @ApiProperty()
    user_id: number;

    @ApiProperty({ nullable: true })
    user_firstname: string;

    @ApiProperty({ nullable: true })
    user_lastname: string;

    @ApiProperty()
    user_phone: string;
}

export class GetDeliveryResponse implements GetDeliveryByIdReturnType {
    @ApiProperty()
    delivery_address: string;

    @ApiProperty()
    delivery_id: string;

    @ApiProperty({ nullable: true, type: GetDeliveryDeliveryBoy })
    delivery_boy: GetDeliveryDeliveryBoy | null;

    @ApiProperty({ enum: DeliveryStatus })
    delivery_status: DeliveryStatus;

    @ApiProperty({ type: Number })
    delivery_price: Decimal;

    @ApiProperty({ nullable: true })
    delivery_finished_at: Date;

    @ApiProperty()
    delivery_created_at: Date;

    @ApiProperty({ type: GetDeliveryOrder, nullable: true })
    order: GetDeliveryOrder;
}