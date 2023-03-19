import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryResponse {
    @ApiProperty()
    category_id: number;

    @ApiProperty()
    category_name: string;

    @ApiProperty()
    category_icon: string;

    @ApiProperty()
    category_slug: string;
}