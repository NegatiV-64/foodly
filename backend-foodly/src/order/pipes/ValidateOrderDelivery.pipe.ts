import type { PipeTransform } from '@nestjs/common';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ValidateOrderDeliveryPipe implements PipeTransform {
  public transform(value: unknown) {
    if (typeof value !== 'string') {
        return undefined;
    }

    if (value !== 'true' && value !== 'false') {
        return undefined;
    }

    return value === 'true';
  }
}