import type { CategoryList } from '@/types/category.types';
import { fetchHandler } from '@/utils/fetch-hander.util';

export const getAllCategories = async () => {
    const response = await fetchHandler<GetAllCategoriesResponse>('/categories', {
        method: 'GET',
    });

    return response;
};

interface GetAllCategoriesResponse {
    categories: CategoryList;
    total: number;
}