import { ApiProperty } from '@nestjs/swagger';

class Product {
    @ApiProperty()
    product_id: number;

    @ApiProperty()
    product_name: string;

    @ApiProperty()
    product_image: string;

    @ApiProperty()
    product_description: string;

    @ApiProperty()
    product_price: number;

    @ApiProperty()
    product_category_id: number;
}

export class PopularProductsResponse {
    @ApiProperty({ type: [Product]})
    products: Product[];
}