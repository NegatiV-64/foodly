import { ApiProperty } from '@nestjs/swagger';

export class GetCategoryResponse {
    @ApiProperty()
    category_id: number;

    @ApiProperty()
    category_icon: string;

    @ApiProperty()
    category_name: string;

    @ApiProperty()
    category_slug: string;
}