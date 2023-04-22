import type { Category } from '@/types/category.types';
import { fetchHandler } from '@/utils/fetch-hander.util';

export const getCategory = async (slug: string) => {
    const response = await fetchHandler<Category>(
        `/categories/${slug}`,
        {
            method: 'GET',
        },
    );

    return response;
};