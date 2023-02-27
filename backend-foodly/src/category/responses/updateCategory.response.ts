import { ApiProperty } from '@nestjs/swagger';

export class UpdateCategoryResponse {
    @ApiProperty()
    category_id: number;

    @ApiProperty()
    category_icon: string;

    @ApiProperty()
    category_name: string;

    @ApiProperty()
    category_slug: string;
}