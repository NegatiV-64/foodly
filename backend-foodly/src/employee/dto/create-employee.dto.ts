import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsPhoneNumber, MinLength, IsIn } from 'class-validator';
import { IsNotEmptyString } from 'src/shared/decorators';
import { employeeTypes, EmployeeType } from '../interfaces';

export class CreateEmployeeDto {
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

    @ApiProperty()
    @IsString()
    @IsNotEmptyString()
    first_name: string;

    @ApiProperty()
    @IsString()
    @IsNotEmptyString()
    last_name: string;

    @ApiProperty()
    @IsString()
    @IsIn(employeeTypes)
    type: EmployeeType;
}