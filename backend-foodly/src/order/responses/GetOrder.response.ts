import { ApiProperty } from '@nestjs/swagger';
import { DeliveryStatus, OrderStatus } from '@prisma/client';

class Product {
    @ApiProperty()
    product_id: string;

    @ApiProperty()
    product_name: string;

    @ApiProperty()
    product_price: number;

    @ApiProperty()
    product_description: string;

    @ApiProperty()
    product_image: string;
}

class User {
    @ApiProperty()
    user_id: number;

    @ApiProperty()
    user_firstname: string;

    @ApiProperty()
    user_lastname: string;

    @ApiProperty()
    user_email: string;

    @ApiProperty()
    user_phone: string;

    @ApiProperty()
    user_address: string;

    @ApiProperty()
    user_type: string;
}

class Delivery {
    @ApiProperty()
    delivery_id: string;

    @ApiProperty()
    delivery_address: string;

    @ApiProperty({ enum: DeliveryStatus })
    delivery_status: DeliveryStatus;

    @ApiProperty({ nullable: true })
    delivery_date: Date | null;

    @ApiProperty()
    delivery_price: number;

    @ApiProperty({ type: User, nullable: true })
    delivery_user: User | null;
}

class Payment {
    @ApiProperty()
    payment_id: string;

    @ApiProperty()
    payment_date: Date;

    @ApiProperty()
    payment_type: string;
}

export class GetOrderResponse {
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
    order_payment_id: string | null;

    @ApiProperty({ nullable: true })
    order_delivery_id: string | null;

    @ApiProperty({ type: [Product] })
    products: Product[];

    @ApiProperty({ type: User })
    user: User;

    @ApiProperty({ nullable: true, type: Delivery })
    delivery: Delivery | null;

    @ApiProperty({ nullable: true, type: Payment })
    payment: Payment | null;
}