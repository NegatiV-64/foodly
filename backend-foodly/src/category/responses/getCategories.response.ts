import { ApiProperty } from '@nestjs/swagger';
import type { Category as PrismaCategory } from '@prisma/client';

export class GetCategoriesResponse {
    @ApiProperty()
    categories: Category[];

    @ApiProperty()
    total: number;
}

class Category implements PrismaCategory {
    @ApiProperty()
    category_id: number;

    @ApiProperty()
    category_name: string;

    @ApiProperty()
    category_icon: string;

    @ApiProperty()
    category_slug: string;
}
