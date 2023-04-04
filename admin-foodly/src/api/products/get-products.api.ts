import { amountToDisplay } from '@/config/pagination.config';
import { fetchHandler } from '@/utils/fetch-handler.util';

export const getProducts = async ({ page = 1, category, order = 'asc', search = '', sort = 'product_id' }: GetProductsQueryParams) => {
    const skip = amountToDisplay * (page - 1);

    const response = await fetchHandler<GetProductsResponse>(
        `/products?take=${amountToDisplay}&skip=${skip}&category=${category ?? ''}&search=${search}&sort=${sort}&order=${order}`,
        {
            method: 'GET',
        },
    );

    return response;
};

interface GetProductsQueryParams {
    page?: number;
    category?: number;
    search?: string;
    sort?: 'product_id' | 'product_name' | 'product_price' | 'category_name' | 'category_id';
    order?: 'asc' | 'desc';
}

interface GetProductsResponse {
    total: number;
    products: {
        product_id: number;
        product_name: string;
        product_image: string;
        product_description: string;
        product_price: number;
        product_category_id: number;
        category: {
            category_id: number;
            category_icon: string;
            category_name: string;
            category_slug: string;
        };
    };
}