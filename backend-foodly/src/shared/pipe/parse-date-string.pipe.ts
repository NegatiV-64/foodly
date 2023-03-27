import type { PipeTransform } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { dayjs } from '../libs/dayjs.lib';

@Injectable()
export class ParseDateStringPipe implements PipeTransform {
    public transform(value: string | undefined) {
        if (value === undefined) {
            return undefined;
        }

        const date = dayjs(value, 'DD-MM-YYYY');

        if (date.isValid() === false) {
            return undefined;
        }

        const formattedData = date.format('YYYY-MM-DD');

        return formattedData;
    }
}