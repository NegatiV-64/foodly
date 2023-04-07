import type { PipeTransform } from '@nestjs/common';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ParseOptionalStringPipe implements PipeTransform {
    public transform(value: unknown): string | undefined {
        if (typeof value === 'string' && value.length > 0) {
            return value;
        }

        return undefined;
    }
}