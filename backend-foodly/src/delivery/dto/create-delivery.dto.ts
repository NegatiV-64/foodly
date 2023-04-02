import { ApiProperty } from '@nestjs/swagger';
import { IsPositive, IsString } from 'class-validator';
import { IsNotEmptyString } from 'src/shared/decorators';

export class CreateDeliveryDto {
    @ApiProperty()
    @IsString()
    order_id: string;

    @ApiProperty()
    @IsNotEmptyString()
    delivery_address: string;

    @ApiProperty()
    @IsPositive()
    delivery_charge: number;
}