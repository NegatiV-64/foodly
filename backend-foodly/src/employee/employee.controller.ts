import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiProperty, ApiQuery, ApiTags } from '@nestjs/swagger';
import { GetCurrentUser } from 'src/shared/decorators';
import { AccessTokenGuard } from 'src/shared/guards';
import { ParseOptionalIntPipe, ValidateOrderByQueryPipe } from 'src/shared/pipe';
import { CreateEmployeeDto } from './dto';
import { EmployeeService } from './employee.service';
import type { EmployeesQuery } from './interfaces';
import { EmployeeType } from './interfaces';
import { CheckEmployeeTypeQueryPipe, CheckEmployeeSortBy } from './pipes';
import { GetEmployeesResponse } from './responses';

@ApiTags('Employee')
@Controller('employees')
export class EmployeeController {
    constructor(private employeeService: EmployeeService) { }

    @ApiProperty({
        description: 'Create employee. Only admins can create employees. Required access token',
    })
    @ApiOkResponse({
        type: CreateEmployeeDto,
    })
    @UseGuards(AccessTokenGuard)
    @Post()
    public async createEmployee(
        @GetCurrentUser('user_id') user_id: number,
        @Body() dto: CreateEmployeeDto,
    ) {
        await this.employeeService.checkEmployeeType(user_id, 'ADMIN');

        await this.employeeService.createEmployee(dto);

        return {
            message: 'Employee created successfully',
        };
    }

    @ApiProperty({
        description: 'Get list of employees. Can be either paginated or not. Only admins and managers can view. Required access token',
    })
    @ApiQuery({
        name: 'take',
        required: false,
        type: Number,
    })
    @ApiQuery({
        name: 'skip',
        required: false,
        type: Number,
    })
    @ApiQuery({
        name: 'type',
        required: false,
        enum: ['ADMIN', 'MANAGER', 'DELIVERY_BOY'],
    })
    @ApiQuery({
        name: 'order',
        required: false,
        enum: ['asc', 'desc']
    })
    @ApiQuery({
        name: 'sort',
        required: false,
        enum: ['user_id', 'user_firstname', 'user_lastname', 'user_email', 'user_type']
    })
    @ApiOkResponse({
        type: GetEmployeesResponse,
    })
    @UseGuards(AccessTokenGuard)
    @Get()
    public async getEmployees(
        @Query('take', ParseOptionalIntPipe) take?: number,
        @Query('skip', ParseOptionalIntPipe) skip?: number,
        @Query('type', CheckEmployeeTypeQueryPipe) type?: EmployeeType,
        @Query('order', ValidateOrderByQueryPipe) order?: 'asc' | 'desc',
        @Query('sort', CheckEmployeeSortBy) sort?: 'user_id' | 'user_firstname' | 'user_lastname' | 'user_email' | 'user_type',
    ) {
        const queryParms: EmployeesQuery = {
            type,
            take,
            skip,
            order: order ?? 'asc',
            sort: sort ?? 'user_id',
        };

        const { employees, total } = await this.employeeService.getEmployees(queryParms);

        return {
            employees,
            total,
        };
    }
}