import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsInt, IsPositive, ValidateNested } from 'class-validator';

export class OrderItem {
    @ApiProperty()
    @IsInt()
    @IsPositive()
    product_id: number;

    @ApiProperty()
    @IsInt()
    @IsPositive()
    quantity: number;
}

export class CreateOrderDto {
    @ApiProperty({ type: [OrderItem] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => OrderItem)
    products: OrderItem[];
}
