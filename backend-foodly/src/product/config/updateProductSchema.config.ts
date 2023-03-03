import type { ApiBodyOptions } from '@nestjs/swagger';

export const updateProductSchema: ApiBodyOptions = {
    schema: {
        type: 'object',
        properties: {
            product_name: {
                type: 'string',
            },
            product_description: {
                type: 'string',
            },
            product_price: {
                type: 'number',
            },
            product_image: {
                type: 'string',
                format: 'binary',
            },
            product_category_id: {
                type: 'number',
            },
        },
        required: []
    }
};