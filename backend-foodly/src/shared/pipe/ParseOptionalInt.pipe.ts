// Write a pipe to parse int value from string and if it's not a number, return undefined
import type { PipeTransform } from '@nestjs/common';

// Path: src/shared/pipe/ParseOptionalInt.pipe.ts

export class ParseOptionalIntPipe implements PipeTransform {
    public transform(value: string): number | undefined {
        // If it is not a number, return undefined
        if (!this.isNumeric(value)) {
            return undefined;
        }

        return parseInt(value, 10);
    }

    protected isNumeric(value: string): boolean {
        return (
            ['string', 'number'].includes(typeof value) &&
            /^-?\d+$/.test(value) &&
            isFinite(value as unknown as number)
        );
    }
}