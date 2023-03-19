import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsPhoneNumber, IsString, MinLength } from 'class-validator';

export class RegisterCustomerDto {
    @ApiProperty()
    @IsString()
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsString()
    @IsPhoneNumber('UZ')
    phone: string;

    @ApiProperty()
    @IsString()
    @MinLength(5)
    password: string;
}