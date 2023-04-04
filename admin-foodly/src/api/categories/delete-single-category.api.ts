import { fetchHandler } from '@/utils/fetch-handler.util';

export const deleteSingleCategory = async (categoryId: number) => {
    const response = await fetchHandler<DeleteSingleCategoryResponse>(
        `/categories/${categoryId}`,
        {
            method: 'DELETE',
        },
        true,
    );

    return response;
};

export interface DeleteSingleCategoryResponse {
    message: string;
}