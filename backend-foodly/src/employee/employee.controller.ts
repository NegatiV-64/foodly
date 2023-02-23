import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiProperty, ApiTags } from '@nestjs/swagger';
import { GetCurrentUser } from 'src/shared/decorators';
import { AccessTokenGuard } from 'src/shared/guards';
import { ValidateOrderByQueryPipe } from 'src/shared/pipe/ValidateOrderByQuery.pipe';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { EmployeeService } from './employee.service';
import type { EmployeesQuery } from './interfaces/employeesQuery.interface';
import { EmployeeType } from './interfaces/employeeType.interface';
import { CheckEmployeeSortBy } from './pipes/CheckEmployeeSortBy.pipe';
import { CheckEmployeeTypeQueryPipe } from './pipes/CheckUserTypeQuery.pipe';

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
    @UseGuards(AccessTokenGuard)
    @Get()
    public async getEmployees(
        @Query('type', CheckEmployeeTypeQueryPipe) type?: EmployeeType,
        @Query('take') take?: number,
        @Query('skip') skip?: number,
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

        const employees = await this.employeeService.getEmployees(queryParms);

        return {
            employees,
        };
    }
}