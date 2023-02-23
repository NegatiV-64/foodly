import type { EmployeeType } from './employeeType.interface';

export interface EmployeesQuery {
    type?: EmployeeType;
    take?: number;
    skip?: number;
    order?: 'asc' | 'desc';
    sort?: 'user_id' | 'user_firstname' | 'user_lastname' | 'user_email' | 'user_type';
}