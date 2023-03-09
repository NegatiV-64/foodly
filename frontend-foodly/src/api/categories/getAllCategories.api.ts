import type { CategoryList } from '@/interfaces/category.interface';
import { fetchHandler } from '@/utils/fetchHander.util';

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