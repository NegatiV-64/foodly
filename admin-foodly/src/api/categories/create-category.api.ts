import type { Category } from '@/interfaces/category.interface';
import { fetchHandler } from '@/utils/fetch-handler.util';

export const createCategory = async (body: CreateCategoryBody) => {
    const response = await fetchHandler<CreateCategoryResponse>(
        '/categories',
        {
            method: 'POST',
            body: JSON.stringify(body),
        },
        true,
    );

    return response;
};

export type CreateCategoryBody = Pick<Category, 'category_name' | 'category_icon'>;

export type CreateCategoryResponse = Category;