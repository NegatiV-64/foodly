import { RoutesConfig } from '@/config/routes.config';
import type { Product } from '@/interfaces/product.inteface';
import { getBackendFileUrl } from '@/utils/getBackendFileUrl.util';
import Image from 'next/image';
import Link from 'next/link';
import type { FC } from 'react';
import { Heading } from '@/components/ui/Heading';
import { Text } from '@/components/ui/Text';
import { moneyFormat } from '@/utils/moneyFormat.util';
import { HiPlus } from 'react-icons/hi';
import { IconButton } from '../IconButton';
import { useCart } from '@/context/cart';

export const ProductCard: FC<ProductCardProps> = ({ product: { product_id, product_image, product_name, product_price } }) => {
    const { addItem } = useCart();


    function onCartAddHandler() {
        addItem({
            product_id,
            product_image,
            product_name,
            product_price,
            product_quantity: 1
        });
    }

    return (
        <article className={'rounded-xl bg-white px-4 pt-3 pb-5 shadow-elevation-1 duration-300 group-hover:shadow-elevation-2'}>
            <Link className='group' href={RoutesConfig.Product(product_id)}>
                <Image
                    src={getBackendFileUrl(product_image)}
                    alt={product_name}
                    width={300}
                    height={300}
                    className={'h-64 w-64 object-contain duration-200 group-hover:scale-95'}
                />
                <Heading
                    as='h4'
                    size='xl'
                    weight='medium'
                >
                    {product_name}
                </Heading>
            </Link>
            <div className='mt-4 flex items-center justify-between'>
                <Text size='xl' weight='bold'>
                    {moneyFormat(product_price)} <span className='text-sm font-normal text-stone-900'>soms</span>
                </Text>
                <IconButton onClick={onCartAddHandler} className='relative z-[1] rounded-lg' size='large'>
                    <HiPlus />
                </IconButton>
            </div>
        </article>
    );
};

interface ProductCardProps {
    product: Product;
}