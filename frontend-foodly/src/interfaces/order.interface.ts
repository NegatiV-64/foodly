import type { Product } from '@/interfaces/product.inteface';
import type { User } from '@/interfaces/user.interface';


interface Order {
    order_id: string;
    order_created_at: Date;
    order_price: number;
    order_status: string;
    order_user_id: number;
    order_payment_id: string | null;
    order_delivery_id: string | null;
    products: Product[];
    user: User;
    delivery: Delivery;
    payment: Payment;
}