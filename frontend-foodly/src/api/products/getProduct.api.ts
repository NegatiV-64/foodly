import type { Product } from '@/types/product.types';
import { fetchHandler } from '@/utils/fetch-hander.util';

export const getProduct = async (id: number) => {
    const resposne = await fetchHandler<Product>(`/products/${id}`);

    return resposne;
};