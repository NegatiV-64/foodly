import type { PipeTransform } from '@nestjs/common';

export class ValidateOrderByQueryPipe implements PipeTransform {
    public transform(value: unknown): 'asc' | 'desc' | undefined {
        if (value === 'asc' || value === 'desc') {
            return value;
        }

        return undefined;
    }
}