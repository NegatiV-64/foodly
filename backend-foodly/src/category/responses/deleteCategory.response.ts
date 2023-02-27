import { ApiProperty } from '@nestjs/swagger';

export class DeleteCategoryResponse {
    @ApiProperty()
    message: string;
}