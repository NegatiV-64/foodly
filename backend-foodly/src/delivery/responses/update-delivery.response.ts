import { ApiProperty } from '@nestjs/swagger';
import { DeliveryStatus, OrderStatus, PaymentType, UserRole } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime';
import type { UpdateDeliveryByIdReturnType } from '../interfaces';

class UpdateDeliveryOrderPayment {
    @ApiProperty()
    payment_id: string;

    @ApiProperty()
    payment_date: Date;

    @ApiProperty({ enum: PaymentType })
    payment_type: PaymentType;
}

class UpdateDeliveryOrderProduct {
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

class UpdateDeliveryOrderUser {
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

class UpdateDeliveryOrder {
    @ApiProperty()
    order_id: string;

    @ApiProperty()
    order_created_at: Date;

    @ApiProperty()
    order_price: number;

    @ApiProperty({ enum: OrderStatus })
    order_status: OrderStatus;

    @ApiProperty({ type: UpdateDeliveryOrderPayment, nullable: true })
    payment: UpdateDeliveryOrderPayment;

    @ApiProperty({ type: [UpdateDeliveryOrderProduct] })
    products: UpdateDeliveryOrderProduct[];

    @ApiProperty({ type: UpdateDeliveryOrderUser, nullable: true })
    user: UpdateDeliveryOrderUser;
}

class UpdateDeliveryDeliveryBoy {
    @ApiProperty()
    user_id: number;

    @ApiProperty({ nullable: true })
    user_firstname: string;

    @ApiProperty({ nullable: true })
    user_lastname: string;

    @ApiProperty()
    user_phone: string;
}

export class UpdateDeliveryResponse implements UpdateDeliveryByIdReturnType {
    @ApiProperty()
    delivery_address: string;

    @ApiProperty()
    delivery_id: string;

    @ApiProperty({ nullable: true, type: UpdateDeliveryDeliveryBoy })
    delivery_boy: UpdateDeliveryDeliveryBoy | null;

    @ApiProperty({ enum: DeliveryStatus })
    delivery_status: DeliveryStatus;

    @ApiProperty({ type: Number })
    delivery_price: Decimal;

    @ApiProperty({ nullable: true })
    delivery_finished_at: Date;

    @ApiProperty()
    delivery_created_at: Date;

    @ApiProperty({ type: UpdateDeliveryOrder, nullable: true })
    order: UpdateDeliveryOrder;
}