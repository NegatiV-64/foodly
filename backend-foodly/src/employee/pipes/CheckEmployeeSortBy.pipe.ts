import type { PipeTransform } from '@nestjs/common';
import type { EmployeesQuery } from '../interfaces/employeesQuery.interface';

export class CheckEmployeeSortBy implements PipeTransform {
    public transform(value: unknown): typeof availableSortBy[number] | undefined {
        if (value !== undefined && typeof value === 'string' && availableSortBy.includes(value as typeof availableSortBy[number]) === false) {
            return undefined;
        }

        if (value !== undefined && typeof value === 'string' && availableSortBy.includes(value as typeof availableSortBy[number]) === true) {
            return value as typeof availableSortBy[number];
        }

        return undefined;
    }
}

const availableSortBy: EmployeesQuery['sort'][] = ['user_id', 'user_firstname', 'user_lastname', 'user_email', 'user_type'];