import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { IsNotEmptyString } from 'src/shared/decorators';

export class UpdateCategoryDto {
    @ApiProperty()
    @IsOptional()
    @IsString()
    @IsNotEmptyString()
    category_name?: string;

    @ApiProperty({
        description: 'Category icon. Must be an emoji. Example: 🍕',
    })
    @IsOptional()
    @IsString()
    @IsNotEmptyString()
    category_icon?: string;
}