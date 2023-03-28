import { ApiProperty } from '@nestjs/swagger';
import { PaymentType } from '@prisma/client';
import { IsCreditCard, IsNumber, IsOptional, IsPositive } from 'class-validator';

export class CreatePaymentDto {
    @ApiProperty()
    order_id: string;

    @ApiProperty({
        enum: PaymentType
    })
    payment_type: PaymentType;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsCreditCard()
    payment_credit_card: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsNumber()
    @IsPositive()
    payment_user_id: number;
}