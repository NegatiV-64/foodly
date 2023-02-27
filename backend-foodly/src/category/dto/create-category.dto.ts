import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { IsNotEmptyString } from 'src/shared/decorators';

export class CreateCategoryDto {
    @ApiProperty()
    @IsString()
    @IsNotEmptyString()
    category_name: string;

    @ApiProperty({
        description: 'Category icon. Must be an emoji. Example: 🍕',
    })
    @IsString()
    @IsNotEmptyString()
    category_icon: string;
}