import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus } from '@prisma/client';

class CreateOrderProduct {
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

export class CreateOrderResponse {
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

    @ApiProperty({ nullable: true })
    order_payment_id: string;

    @ApiProperty({ nullable: true })
    order_delivery_id: string;

    @ApiProperty({ type: [CreateOrderProduct] })
    order_products: CreateOrderProduct[];
}

