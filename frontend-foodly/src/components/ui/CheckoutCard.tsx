import type { CartItem} from '@/context/cart';
import { useCart } from '@/context/cart';
import { getBackendFileUrl } from '@/utils/get-backend-file-url.util';
import Image from 'next/image';
import type { FC } from 'react';
import { Heading } from '@/components/ui/Heading';
import { Text } from '@/components/ui/Text';
import { IconButton } from '@/components/ui/IconButton';
import { HiMinus, HiPlus } from 'react-icons/hi';
import { moneyFormat } from '@/utils/money-format.util';

export const CheckoutCard: FC<CheckoutCardProps> = ({ product }) => {
    const { decreaseQuantity, increaseQuantity } = useCart();

    function onDecreaseQuantity() {
        decreaseQuantity(product.product_id);
    }

    function onIncreaseQuantity() {
        increaseQuantity(product.product_id);
    }

    return (
        <article className='grid w-full grid-cols-[0.8fr,1.4fr,0.8fr] items-center gap-x-5 border-b border-solid border-b-gray-200 py-4' key={product.product_id}>
            <Image
                className='h-28 w-28 justify-self-center object-contain'
                src={getBackendFileUrl(product.product_image)}
                alt={product.product_name}
                width={120}
                height={120}
            />
            <div>
                <Heading as='h3' size='lg' className='mb-3'>
                    {product.product_name}
                </Heading>
                <Text size='base'>
                    Price: {moneyFormat(product.product_price)} soms
                </Text>
            </div>
            <div className='flex items-center gap-x-3'>
                <IconButton onClick={onDecreaseQuantity} size='small'>
                    <HiMinus />
                </IconButton>
                <Text as='span'>
                    {product.product_quantity}
                </Text>
                <IconButton onClick={onIncreaseQuantity} size='small'>
                    <HiPlus />
                </IconButton>
            </div>
        </article>
    );
};


interface CheckoutCardProps {
    product: CartItem;
}
