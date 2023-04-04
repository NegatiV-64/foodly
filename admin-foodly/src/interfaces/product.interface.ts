import type { Category } from './category.interface';

export interface Product {
    product_id: number;
    product_name: string;
    product_description: string;
    product_price: number;
    product_image: string;
    product_category_id: number;
    category: Category;
}