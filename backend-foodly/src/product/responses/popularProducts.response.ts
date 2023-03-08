import { ApiProperty } from '@nestjs/swagger';

class Category {
    @ApiProperty()
    category_id: number;

    @ApiProperty()
    category_icon: string;

    @ApiProperty()
    category_name: string;

    @ApiProperty()
    category_slug: string;
}

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

    @ApiProperty({ type: () => Category })
    category: Category;
}

export class PopularProductsResponse {
    @ApiProperty({ type: [Product]})
    products: Product[];
}

