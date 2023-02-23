import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsPhoneNumber, IsString, MinLength } from 'class-validator';
export class UpdateAccountDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsEmail()
    @IsString()
    user_email?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    @IsPhoneNumber('UZ')
    user_phone?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    @MinLength(5)
    user_old_password?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    @MinLength(5)
    user_new_password?: string;

    @ApiPropertyOptional({ nullable: true })
    @IsOptional()
    @IsString()
    user_address?: string;

    @ApiPropertyOptional({ nullable: true })
    @IsOptional()
    @IsString()
    user_firstname?: string;

    @ApiPropertyOptional({ nullable: true })
    @IsOptional()
    @IsString()
    user_lastname?: string;
}