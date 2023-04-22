import { Button } from '@/components/ui/Button';
import { Fragment, useEffect, useRef, useState } from 'react';
import type { FC } from 'react';
import { HiMinus, HiOutlineShoppingBag, HiPlus, HiX } from 'react-icons/hi';
import { cn } from '@/utils/cn.util';
import { Heading } from '@/components/ui/Heading';
import { IconButton } from '@/components/ui/IconButton';
import Image from 'next/image';
import type { CartItem } from '@/context/cart';
import { useCart } from '@/context/cart';
import { Text } from '@/components/ui/Text';
import { getBackendFileUrl } from '@/utils/get-backend-file-url.util';
import { moneyFormat } from '@/utils/money-format.util';
import { Link } from '@/components/navigation/Link';
import { RoutesConfig } from '@/config/routes.config';

export const Cart: FC = () => {
    const cartContentRef = useRef<HTMLDivElement>(null);
    const [cartContentShow, setCartContentShow] = useState(false);

    const { items, totalQuantity, totalPrice } = useCart();

    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (cartContentRef.current && !cartContentRef.current.contains(event.target as Node)) {
                setCartContentShow(false);
            }
        };

        document.addEventListener('mousedown', handleOutsideClick);

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, []);

    useEffect(() => {
        const scrollBarWidth = window.innerWidth - document.body.clientWidth;

        if (cartContentShow) {
            document.body.style.overflow = 'hidden';
            document.body.style.paddingRight = `${scrollBarWidth}px`;
        } else {
            document.body.style.overflow = 'unset';
            document.body.style.paddingRight = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
            document.body.style.paddingRight = 'unset';
        };
    }, [cartContentShow]);

    function onOpenCartContent() {
        setCartContentShow(true);
    }

    function onCloseCartContent() {
        setCartContentShow(false);
    }

    function onCheckoutClickHandler() {
        onCloseCartContent();
    }

    return (
        <Fragment>
            <Button onClick={onOpenCartContent} type='button' className='flex h-full items-center gap-x-2 bg-orange-500 px-5 py-2 text-white hover:scale-105'>
                Cart
                <div className='h-4/5 w-[2px] bg-white' />
                {
                    totalQuantity > 0
                        ?
                        <span key={totalQuantity} className='text-lg font-bold animate-in zoom-in-[180%] repeat-1'>{totalQuantity}</span>
                        :
                        <HiOutlineShoppingBag className='h-[28px] text-lg' />
                }
            </Button>
            <div ref={cartContentRef} className={cn(
                'fixed top-0 right-0 z-20 h-full w-[30%] bg-white duration-300 shadow-elevation-2 rounded-l-lg',
                'px-5 py-3 overflow-auto',
                {
                    '-right-full': cartContentShow === false,
                }
            )}>
                <div className='relative'>
                    <Heading className='mb-5 text-center' size='3xl'>
                        Your Cart
                    </Heading>
                    <IconButton onClick={onCloseCartContent} className='absolute top-0 right-0 rounded-lg'>
                        <HiX />
                    </IconButton>
                    {
                        items.length > 0
                            ?
                            <Fragment>
                                <div className='mb-12 flex flex-col gap-y-3'>
                                    {
                                        items.map((item) => {
                                            return (
                                                <CartProduct key={item.product_id} item={item} />
                                            );
                                        })
                                    }
                                </div>
                                <div className='h-[2px] w-full bg-gray-300' />
                                <div className='mt-5 flex items-end justify-between'>
                                    <span className='text-2xl font-medium'>
                                        Total:
                                    </span>
                                    <span className='text-lg font-medium'>
                                        {moneyFormat(totalPrice)} soms
                                    </span>
                                </div>
                                <Link onClick={onCheckoutClickHandler} className='mt-5 w-full' href={RoutesConfig.Checkout}>
                                    Checkout
                                </Link>
                            </Fragment>
                            :
                            <div className='mb-12'>
                                <Text size='lg' className='text-center'>
                                    Your cart is empty. Please, add some products to your cart before trying to checkout.
                                </Text>
                            </div>
                    }
                </div>
            </div>
            {
                cartContentShow && (
                    <div className='fixed top-0 left-0 z-10 h-full w-full backdrop-blur-sm' />
                )
            }
        </Fragment>
    );
};

const CartProduct = ({ item }: { item: CartItem }) => {
    const { increaseQuantity, decreaseQuantity } = useCart();

    function onDescreaseHandler() {
        decreaseQuantity(item.product_id);
    }

    function onIncreaseHandler() {
        increaseQuantity(item.product_id);
    }

    return (
        <article className='grid grid-cols-[0.8fr,1.4fr,0.8fr] items-center gap-x-3 rounded-b-lg border-b-2 border-solid border-b-orange-500 px-1 pb-2'>
            <Image
                src={getBackendFileUrl(item.product_image)}
                alt={item.product_name}
                width={100}
                height={100}
            />
            <div className=''>
                <Heading size='xl' className=''>
                    {item.product_name}
                </Heading>
                <Text size='lg'>
                    {moneyFormat(item.product_price * item.product_quantity)} soms
                </Text>
            </div>
            <div className='flex items-center gap-2'>
                <IconButton size='small' onClick={onDescreaseHandler}>
                    <HiMinus />
                </IconButton>
                <Text>
                    {item.product_quantity}
                </Text>
                <IconButton size='small' onClick={onIncreaseHandler}>
                    <HiPlus />
                </IconButton>
            </div>
        </article>
    );
};