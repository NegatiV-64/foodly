import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    product_name: string;

    @IsString()
    @IsNotEmpty()
    product_description: string;

    @Transform(({ value }) => Number(value))
    @IsNumber()
    @Min(0)
    product_price: number;

    @Transform(({ value }) => Number(value))
    @IsNumber()
    @Min(0)
    product_category_id: number;
}