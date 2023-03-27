import { ApiProperty } from '@nestjs/swagger';

export class DeleteDeliveryResponse {
    @ApiProperty({
        enum: ['Delivery deleted successfully'],
    })
    message: string;
}