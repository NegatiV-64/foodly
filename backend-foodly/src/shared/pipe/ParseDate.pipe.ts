import type { PipeTransform } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import * as dayjs from 'dayjs';
import * as customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);

@Injectable()
export class ParseDatePipe implements PipeTransform {
    public transform(value: string | undefined) {
        if (value === undefined) {
            return undefined;
        }

        const date = dayjs(value, 'DD-MM-YYYY');

        if (date.isValid() === false) {
            return undefined;
        }

        return value;
    }
}