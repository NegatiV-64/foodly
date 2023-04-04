import type { Category } from '@/interfaces/category.interface';
import { fetchHandler } from '@/utils/fetch-handler.util';

export const getSingleCategory = async (categorySlug: string) => {
    const response = await fetchHandler<GetSingleCategoryResponse>(
        `/categories/${categorySlug}`,
        {
            method: 'GET',
        },
    );

    return response;
};

export type GetSingleCategoryResponse = Category;