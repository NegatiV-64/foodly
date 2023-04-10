import type { PipeTransform } from '@nestjs/common';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ParseUserSortPipe implements PipeTransform {
    public transform(value: unknown) {
        if (typeof value !== 'string') {
            return undefined;
        }

        const possibleSorts = ['user_id', 'user_email', 'user_type', 'user_lastname'];

        if (!possibleSorts.includes(value)) {
            return undefined;
        }

        return value;
    }
}