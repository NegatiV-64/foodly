import { getProduct } from '@/api/products/getProduct.api';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Heading } from '@/components/ui/Heading';
import { IconButton } from '@/components/ui/IconButton';
import { Text } from '@/components/ui/Text';
import { Page } from '@/components/utility/Page';
import type { Product } from '@/interfaces/product.inteface';
import { generateShimmer } from '@/utils/generateShimmer.util';
import { getBackendFileUrl } from '@/utils/getBackendFileUrl.util';
import { moneyFormat } from '@/utils/moneyFormat.util';
import { validateDynamicUrlPart } from '@/utils/validateDynamicUrlPart.util';
import type { GetServerSideProps, NextPage } from 'next';
import Image from 'next/image';
import { HiMinus, HiOutlineShoppingCart, HiPlus } from 'react-icons/hi';

const ProductPage: NextPage<ProductPageProps> = ({ product }) => {
    return (
        <Page title={`${product.product_name}`}>
            <section className='py-10'>
                <Container className='grid grid-cols-2 justify-center gap-12'>
                    <Image
                        className='h-full w-[400px] justify-self-center rounded-lg object-contain'
                        src={getBackendFileUrl(product.product_image)}
                        alt={product.product_name}
                        width={500}
                        height={500}
                        priority={true}
                        placeholder="blur"
                        blurDataURL={generateShimmer(500, 500)}
                    />
                    <div className='flex flex-col'>
                        <Heading size='4xl' className='mb-5'>{product.product_name}</Heading>
                        <Text size='lg' className='mb-5 text-gray-500'>{product.product_description}</Text>
                        <Text size='3xl' className='mb-7 font-bold'>
                            {moneyFormat(product.product_price)}
                            <span className='ml-1 text-lg font-normal'>
                                soms
                            </span>
                        </Text>
                        <div className='mt-auto mb-5 flex items-center gap-2'>
                            <IconButton>
                                <HiMinus />
                            </IconButton>
                            <Text>1</Text>
                            <IconButton>
                                <HiPlus />
                            </IconButton>
                        </div>
                        <Button startIcon={<HiOutlineShoppingCart />} className='w-fit'>
                            Add to cart
                        </Button>
                    </div>
                </Container>
            </section>
        </Page>
    );
};


// I know that I could use getStaticProps here. However, since it is a
// university project, I will use getServerSideProps. But, in a real
// project, I suggest you to use getStaticProps. This is because page loading time
// would be much faster than getServerSideProps.
export const getServerSideProps: GetServerSideProps<ProductPageProps> = async (context) => {
    const productId = validateDynamicUrlPart(context.params?.productId, 'number');
    if (productId === null) {
        return {
            notFound: true,
        };
    }

    const { ok, data } = await getProduct(productId);

    if (ok === false || data === null) {
        // I know that this is not the best way to handle errors
        // but I am lazy. So I will just return notFound. :)
        return {
            notFound: true,
        };
    }

    return {
        props: {
            product: data,
        }
    };
};

interface ProductPageProps {
    product: Product;
}

export default ProductPage;