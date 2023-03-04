import type { PipeTransform } from '@nestjs/common';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ValidateOrderByQueryPipe implements PipeTransform {
    public transform(value: unknown): 'asc' | 'desc' | undefined {
        if (value === 'asc' || value === 'desc') {
            return value;
        }

        return undefined;
    }
}