import type { ValidationPipeOptions } from '@nestjs/common';

export const validatorConfig: ValidationPipeOptions = {
    whitelist: true,
};