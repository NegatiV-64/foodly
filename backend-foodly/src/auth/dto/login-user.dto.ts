import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, MinLength } from 'class-validator';

export class LoginUserDto {
    @ApiProperty()
    @IsString()
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsString()
    @MinLength(5)
    password: string;
}