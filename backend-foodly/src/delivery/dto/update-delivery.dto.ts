import { ApiProperty } from '@nestjs/swagger';
import { DeliveryStatus } from '@prisma/client';
import { IsIn, IsInt,  IsOptional, IsPositive, IsString } from 'class-validator';
import { IsDateWithFormat } from 'src/shared/decorators';

const deliveryStatuses = Object.values(DeliveryStatus);

export class UpdateDeliveryDto {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    order_id?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    delivery_address?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    delivery_charge?: number;

    @ApiProperty({ enum: DeliveryStatus, required: false })
    @IsOptional()
    @IsString()
    @IsIn(deliveryStatuses)
    delivery_status?: DeliveryStatus;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    @IsDateWithFormat()
    delivery_finished_at?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsInt()
    @IsPositive()
    delivery_boy_id?: number;
}