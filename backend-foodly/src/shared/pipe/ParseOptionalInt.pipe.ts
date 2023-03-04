import type { PipeTransform } from '@nestjs/common';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ParseOptionalIntPipe implements PipeTransform {
    public transform(value: string): number | undefined {
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