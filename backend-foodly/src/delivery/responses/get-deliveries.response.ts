import { ApiProperty } from '@nestjs/swagger';
import { DeliveryStatus } from '@prisma/client';

class GetDeliveriesDeliveryBoy {
    @ApiProperty()
    user_id: number;

    @ApiProperty({ nullable: true })
    user_firstname: string;

    @ApiProperty({ nullable: true })
    user_lastname: string;

    @ApiProperty()
    user_phone: string;
}

class GetDeliveriesDelivery {
    @ApiProperty()
    delivery_id: string;

    @ApiProperty({ nullable: true })
    delivery_boy_id: number;

    @ApiProperty({ type: GetDeliveriesDeliveryBoy, nullable: true })
    delivery_boy: GetDeliveriesDeliveryBoy;

    @ApiProperty({ enum: DeliveryStatus })
    delivery_status: DeliveryStatus;

    @ApiProperty()
    delivery_price: number;

    @ApiProperty()
    delivery_address: string;

    @ApiProperty({ nullable: true })
    delivery_finished_at: Date;

    @ApiProperty()
    delivery_created_at: Date;

    @ApiProperty()
    delivery_order_id: string;
}

export class GetDeliveriesResponse {
    @ApiProperty({ type: [GetDeliveriesDelivery] })
    deliveries: GetDeliveriesDelivery[];

    @ApiProperty()
    total: number;
}