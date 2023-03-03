import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class UpdateProductDto {
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    product_name?: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    product_description?: string;

    @IsOptional()
    @Transform(({ value }) => Number(value))
    @IsNumber()
    @Min(0)
    product_price?: number;

    @IsOptional()
    @Transform(({ value }) => Number(value))
    @IsNumber()
    @Min(0)
    product_category_id?: number;
}