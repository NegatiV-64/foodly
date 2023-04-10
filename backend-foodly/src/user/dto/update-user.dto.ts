import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { IsOptional, IsString, IsEmail, IsPhoneNumber, IsEnum, MinLength, IsBoolean } from 'class-validator';

export class UpdateUserDto {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    @IsEmail()
    email?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    @IsPhoneNumber()
    phone?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    firstname?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    lastname?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    @MinLength(5)
    password?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    address?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    @IsEnum(UserRole)
    role?: UserRole;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsBoolean()
    is_verified?: boolean;
}