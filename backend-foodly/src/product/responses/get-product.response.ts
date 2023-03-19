import { ApiProperty } from '@nestjs/swagger';

class GetProductCategory {
    @ApiProperty()
    category_id: number;

    @ApiProperty()
    category_icon: string;

    @ApiProperty()
    category_name: string;

    @ApiProperty()
    category_slug: string;
}

export class GetProductResponse {
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

    @ApiProperty({ type: GetProductCategory })
    category: GetProductCategory;
}
