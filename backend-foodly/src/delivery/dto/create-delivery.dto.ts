import { IsPositive, IsString } from 'class-validator';
import { IsNotEmptyString } from 'src/shared/decorators';

export class CreateDeliveryDto {
    @IsString()
    order_id: string;

    @IsNotEmptyString()
    delivery_address: string;

    @IsPositive()
    delivery_charge: number;
}