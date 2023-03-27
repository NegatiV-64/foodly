import { ApiProperty } from '@nestjs/swagger';
import { DeliveryStatus } from '@prisma/client';

export class CreateDeliveryResponse {
    @ApiProperty()
    delivery_id: string;

    @ApiProperty({
        nullable: true,
        description: 'User id of the delivery boy'
     })
    delivery_boy_id: number;

    @ApiProperty({
        enum: DeliveryStatus,
    })
    delivery_status: DeliveryStatus;

    @ApiProperty({
        description: 'Price of the delivery, including the delivery charge'
    })
    delivery_price: number;

    @ApiProperty()
    delivery_address: string;

    @ApiProperty({
        nullable: true,
        description: 'Date when the delivery was finished. Would be always null for created deliveries'
    })
    delivery_finished_at: Date;

    @ApiProperty()
    delivery_started_at: Date;

    @ApiProperty()
    delivery_order_id: string;
}