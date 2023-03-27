import { ApiProperty } from '@nestjs/swagger';
import { DeliveryStatus } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime';

class GetDeliveriesOfUserDeliveryBoy {
    @ApiProperty()
    user_id: number;

    @ApiProperty({ nullable: true })
    user_firstname: string;

    @ApiProperty({ nullable: true })
    user_lastname: string;

    @ApiProperty()
    user_phone: string;
}

class GetDeliveriesOfUserDelivery {
    @ApiProperty()
    delivery_address: string;

    @ApiProperty()
    delivery_id: string;

    @ApiProperty({ enum: DeliveryStatus })
    delivery_status: DeliveryStatus;

    @ApiProperty({ type: Number })
    delivery_price: Decimal;

    @ApiProperty({ nullable: true })
    delivery_finished_at: Date;

    @ApiProperty()
    delivery_created_at: Date;

    @ApiProperty()
    delivery_order_id: string;

    @ApiProperty({ nullable: true, type: GetDeliveriesOfUserDeliveryBoy })
    delivery_boy: GetDeliveriesOfUserDeliveryBoy;
}

export class GetDeliveriesOfUserResponse {
    @ApiProperty({ type: [GetDeliveriesOfUserDelivery] })
    deliveries: GetDeliveriesOfUserDelivery[];

    @ApiProperty()
    total: number;
}

