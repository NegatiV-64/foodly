import type { Product } from '@/interfaces/product.inteface';
import { fetchHandler } from '@/utils/fetchHander.util';

export const getProduct = async (id: number) => {
    const resposne = await fetchHandler<Product>(`/products/${id}`);

    return resposne;
};