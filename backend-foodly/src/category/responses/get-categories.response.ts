import { ApiProperty } from '@nestjs/swagger';
import type { Category as PrismaCategory } from '@prisma/client';


class GetCategoriesCategory implements PrismaCategory {
    @ApiProperty()
    category_id: number;

    @ApiProperty()
    category_name: string;

    @ApiProperty()
    category_icon: string;

    @ApiProperty()
    category_slug: string;
}


export class GetCategoriesResponse {
    @ApiProperty({ type: [GetCategoriesCategory] })
    categories: GetCategoriesCategory[];

    @ApiProperty()
    total: number;
}