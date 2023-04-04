import type { Category } from '@/interfaces/category.interface';
import { fetchHandler } from '@/utils/fetch-handler.util';

export const updateSingleCategory = async (categoryId: number, body: UpdateSingleCategoryBody) => {
    const response = await fetchHandler<UpdateSingleCategoryResponse>(
        `/categories/${categoryId}`,
        {
            method: 'PATCH',
            body: JSON.stringify(body),
        },
        true,
    );

    return response;
};

export type UpdateSingleCategoryBody = Pick<Category, 'category_name' | 'category_icon'>;
export type UpdateSingleCategoryResponse = Category;