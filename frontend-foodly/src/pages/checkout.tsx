import { Container } from '@/components/ui/Container';
import { Heading } from '@/components/ui/Heading';
import { IconButton } from '@/components/ui/IconButton';
import { Text } from '@/components/ui/Text';
import { Page } from '@/components/utility/Page';
import { Protected } from '@/components/utility/Protected';
import { useCart } from '@/context/cart';
import { getBackendFileUrl } from '@/utils/getBackendFileUrl.util';
import type { NextPage } from 'next';
import Image from 'next/image';
import { Fragment } from 'react';
import { HiMinus, HiPlus } from 'react-icons/hi';


const CheckoutPage: NextPage = () => {
    const { items } = useCart();

    const shouldRenderCheckout = items.length > 0;

    return (
        <Page title='Checkout'>
            <Protected>
                <section className='flex h-full grow flex-col pt-7'>
                    <Container className='flex grow flex-col rounded-lg bg-white py-3'>
                        {
                            shouldRenderCheckout
                                ?
                                <Fragment>
                                    <div>
                                        <Heading className='text-center' as='h2' size='3xl'>
                                            Checkout your cart
                                        </Heading>
                                        <Text className='mx-auto my-3 w-3/4 text-center text-gray-500' size='lg'>
                                            Please, review your cart before checkout. You can change the quantity of each meal or remove it from the cart if you don&apos;t want it anymore. After reviewing your cart, you can proceed to checkout.
                                        </Text>
                                        <div>
                                            {
                                                items.map((product) => {
                                                    return (
                                                        <article className='flex w-fit items-center gap-x-5 border-b border-solid border-b-gray-200 pb-1' key={product.product_id}>
                                                            <Image
                                                                src={getBackendFileUrl(product.product_image)}
                                                                alt={product.product_name}
                                                                width={150}
                                                                height={150}
                                                            />
                                                            <div>
                                                                <Heading as='h3' size='xl' className='mb-3'>
                                                                    {product.product_name}
                                                                </Heading>
                                                                <Text size='base'>
                                                                    Price: {product.product_price}
                                                                </Text>
                                                            </div>
                                                            <div className='flex items-center gap-x-3'>
                                                                <IconButton>
                                                                    <HiMinus />
                                                                </IconButton>
                                                                <Text as='span'>
                                                                    {product.product_quantity}
                                                                </Text>
                                                                <IconButton>
                                                                    <HiPlus />
                                                                </IconButton>
                                                            </div>
                                                        </article>
                                                    );
                                                })
                                            }
                                        </div>
                                        <div>
                                            Total:
                                        </div>
                                    </div>
                                </Fragment>
                                :
                                <div className='flex grow flex-col items-center pt-5'>
                                    <Text as='span' className='mb-3 text-4xl'>
                                        😢
                                    </Text>
                                    <Text size='2xl' weight='medium'>
                                        Your cart is empty {':('}
                                    </Text>
                                </div>
                        }
                    </Container>
                </section>
            </Protected>
        </Page>
    );
};

export default CheckoutPage;