import { ApiProperty } from '@nestjs/swagger';
import { PaymentType } from '@prisma/client';
import { IsCreditCard, IsEnum, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';

export class CreatePaymentDto {
    @ApiProperty()
    @IsString()
    order_id: string;

    @ApiProperty({
        enum: PaymentType
    })
    @IsString()
    @IsEnum(PaymentType)
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