export interface EmployeesQuery {
    type?: EmployeeType;
    take?: number;
    skip?: number;
    order?: 'asc' | 'desc';
    sort?: 'user_id' | 'user_firstname' | 'user_lastname' | 'user_email' | 'user_type';
}

export const employeeTypes = ['ADMIN', 'MANAGER', 'DELIVERY_BOY'];

export type EmployeeType = 'ADMIN' | 'MANAGER' | 'DELIVERY_BOY';