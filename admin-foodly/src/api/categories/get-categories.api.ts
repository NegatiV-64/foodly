import type { Category } from '@/interfaces/category.interface';
import { fetchHandler } from '@/utils/fetch-handler.util';

export const getCategories = async () => {
    const response = await fetchHandler<GetCategoriesResponse>(
        '/categories',
        {
            method: 'GET',
        },
    );

    return response;
};

export interface GetCategoriesResponse {
    total: number;
    categories: Category[];
}