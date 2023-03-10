import type { PipeTransform } from '@nestjs/common';
import type { EmployeeType } from '../interfaces/employeeType.interface';
import { employeeTypes } from '../interfaces/employeeType.interface';

export class CheckEmployeeTypeQueryPipe implements PipeTransform {
    public transform(value: any) {
        if (value !== undefined && typeof value === 'string' && employeeTypes.includes(value.toUpperCase()) === false) {
            return undefined;
        }

        if (value !== undefined && typeof value === 'string' && employeeTypes.includes(value.toUpperCase()) === true) {
            return value.toUpperCase() as EmployeeType;
        }

        return value as EmployeeType | undefined;
    }
}