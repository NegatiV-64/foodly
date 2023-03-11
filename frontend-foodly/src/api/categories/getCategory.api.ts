import type { Category } from '@/interfaces/category.interface';
import { fetchHandler } from '@/utils/fetchHander.util';

export const getCategory = async (slug: string) => {
    const response = await fetchHandler<Category>(
        `/categories/${slug}`,
        {
            method: 'GET',
        },
    );

    return response;
};