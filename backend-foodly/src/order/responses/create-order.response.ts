import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime';
import type { CreateOrderReturnType } from '../interfaces';

class CreateOrderProduct {
    @ApiProperty()
    product_id: number;

    @ApiProperty()
    product_name: string;

    @ApiProperty({ type: Number })
    product_price: Decimal;

    @ApiProperty()
    product_description: string;

    @ApiProperty()
    product_image: string;

    @ApiProperty()
    product_category_id: number;
}

export class CreateOrderResponse implements CreateOrderReturnType {
    @ApiProperty()
    order_id: string;

    @ApiProperty()
    order_created_at: Date;

    @ApiProperty({ type: Number })
    order_price: Decimal;

    @ApiProperty({ enum: OrderStatus })
    order_status: OrderStatus;

    @ApiProperty()
    order_user_id: number;

    @ApiProperty({ type: [CreateOrderProduct] })
    products: CreateOrderProduct[];
}

