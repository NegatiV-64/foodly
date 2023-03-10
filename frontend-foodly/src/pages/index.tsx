import type { GetServerSideProps, NextPage } from 'next';
import { getAllCategories } from '@/api/categories/getAllCategories.api';
import { getPopularProducts } from '@/api/products/getPopularProducts.api';
import { Page } from '@/components/utility/Page';
import type { CategoryList } from '@/interfaces/category.interface';
import type { ReactNode } from 'react';
import { Container } from '@/components/ui/Container';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import { cn } from '@/utils/cn.util';
import NextLink from 'next/link';
import { RoutesConfig } from '@/config/routes.config';
import { Heading } from '@/components/ui/Heading';
import { Text } from '@/components/ui/Text';
import Image from 'next/image';
import type { ProductList } from '@/interfaces/product.inteface';
import { ProductCard } from '@/components/ui/ProductCard';
import { HiArrowRight, HiOutlineClock, HiOutlineFire, HiOutlineMail, HiOutlinePhone, HiOutlineTruck } from 'react-icons/hi';
import { Button } from '@/components/ui/Button';
import { Link } from '@/components/ui/Link';

const HomePage: NextPage<HomePageProps> = ({ categories, popularProducts }) => {
    const formStyles = {
        label: 'sr-only',
        input: 'block w-full rounded-md border-gray-300 py-3 px-4 placeholder-gray-500 shadow-sm focus:border-orange-500 focus:ring-orange-500',
        textarea: 'block w-full rounded-md border-gray-300 py-3 px-4 placeholder-gray-500 shadow-sm focus:border-orange-500 focus:ring-orange-500'
    };

    return (
        <Page title='Home'>
            <Section className='flex items-center py-10'>
                <Container className='grid grid-cols-[1.1fr,0.9fr]'>
                    <div className='flex h-full flex-col justify-center gap-5'>
                        <Heading size='6xl' className='text-center'>
                            <span className='text-orange-500'>
                                Order your favorite food
                            </span>
                            <br /> from your favorite restaurant
                        </Heading>
                        <Text size='xl' className='mx-auto w-3/4 text-center text-gray-500'>
                            Choose what you want to eat from our wide selection of meals and order a delivery to your door without any hassle. We are here to make your life easier and tastier.
                        </Text>
                    </div>
                    <Image
                        className='w-full object-contain'
                        src={'/home-hero.png'}
                        alt={'Foodly - Order your favorite food from your favorite restaurant'}
                        width={800}
                        height={600}
                        priority={true}
                    />
                </Container>
            </Section>
            <Section className='pt-7'>
                <Container>
                    <div className='mb-4 flex justify-between'>
                        <Heading size='3xl' className=''>Categories</Heading>
                        <Link className='shadow-none' startIcon={<HiArrowRight />} href={RoutesConfig.Categories}>
                            View All
                        </Link>
                    </div>
                    <Swiper
                        className='flex h-full w-full justify-center'
                        slidesPerView={6}
                        modules={[Navigation]}
                        spaceBetween={50}
                        navigation={{
                            hideOnClick: true,
                        }}
                        loop={true}
                    >
                        {
                            categories.map((category) => (
                                <SwiperSlide
                                    className={cn(
                                        'py-3'
                                    )}
                                    key={category.category_id}
                                >
                                    <NextLink
                                        className={cn(
                                            '!flex flex-col gap-y-2 justify-center items-center',
                                            'bg-white shadow-sm rounded-xl',
                                            'py-3 px-5 duration-200',
                                            'hover:shadow-md',
                                        )}
                                        href={RoutesConfig.Category(category.category_slug)}
                                    >
                                        <span className='text-4xl'>{category.category_icon}</span>
                                        <Heading as={'h3'} size={'lg'} weight={'normal'} className=''>{category.category_name}</Heading>
                                    </NextLink>
                                </SwiperSlide>
                            ))
                        }
                    </Swiper>
                </Container>
            </Section>
            <Section>
                <Container>
                    <Heading size='3xl' className='mb-3'>Popular Products</Heading>
                    <div className=' grid grid-cols-4 gap-7'>
                        {
                            popularProducts.map((product) => (
                                <ProductCard
                                    key={product.product_id}
                                    product={product}
                                />
                            ))
                        }
                    </div>
                </Container>
            </Section>
            <Section>
                <Container>
                    <Heading size='4xl' className='mb-6 text-center'>Why Foodly?</Heading>
                    <ul className='flex justify-between'>
                        <li className='flex flex-col items-center justify-center'>
                            <HiOutlineClock className='mb-2 text-4xl text-orange-500' />
                            <Heading size='2xl'>Fast Delivery</Heading>
                            <Text size='lg' className='text-center text-gray-500'>
                                We deliver your food in less than 30 minutes.
                            </Text>
                        </li>
                        <li className='flex flex-col items-center justify-center'>
                            <HiOutlineFire className={'mb-2 text-4xl text-orange-500'} />
                            <Heading size='2xl'>Quality Food</Heading>
                            <Text size='lg' className='text-center text-gray-500'>
                                We only deliver the best quality food.
                            </Text>
                        </li>
                        <li className='flex flex-col items-center justify-center'>
                            <HiOutlineTruck className={'mb-2 text-4xl text-orange-500'} />
                            <Heading size='2xl'>Easy Ordering</Heading>
                            <Text size='lg' className='text-center text-gray-500'>
                                You can order your food in just a few clicks.
                            </Text>
                        </li>
                    </ul>
                </Container>
            </Section>
            <Section className='bg-white'>
                <Container className='grid grid-cols-[0.8fr,1.2fr] gap-x-24'>
                    <div>
                        <Heading size='3xl' className='mb-3'>Get in touch</Heading>
                        <Text size='xl' weight='light' className='mb-8 leading-6 text-gray-500'>
                            If you have any questions or suggestions, please feel free to contact us. We are always happy to help. You can also contact us via email or phone too.
                        </Text>
                        <address className='mb-6 text-lg not-italic text-gray-500'>
                            17 Market Street, Yakassaroy 15<br />
                            Tashkent, Uzbekistan
                        </address>
                        <a className='mb-3 flex items-center gap-x-2 text-lg text-gray-500' href='tel:998112223355'>
                            <HiOutlinePhone className='text-2xl' />
                            +998 11 222 33 55</a>
                        <a className='flex items-center gap-x-2 text-lg text-gray-500' href='mailto:test@test.com'>
                            <HiOutlineMail className='text-2xl' />
                            test@test.com
                        </a>
                    </div>
                    <form className='grid grid-cols-1 gap-y-6'>
                        <input
                            className={formStyles.input}
                            type='text'
                            id='full-name'
                            name='full-name'
                            placeholder="Full name"
                            autoComplete="full-name"
                            required={true}
                        />
                        <input
                            className={formStyles.input}
                            type='email'
                            id='email'
                            name="email"
                            autoComplete="email"
                            placeholder="Email address"
                            required={true}
                        />
                        <textarea
                            className={formStyles.textarea}
                            rows={4}
                            id="message"
                            name="message"
                            placeholder="Message"
                            defaultValue={''}
                        />
                        <Button type='submit'>Submit</Button>
                    </form>
                </Container>
            </Section>
        </Page>
    );
};

const Section = ({ children, className }: { className?: string; children: ReactNode }) => (
    <section className={cn('py-10', className)}>
        {children}
    </section>
);

export const getServerSideProps: GetServerSideProps<HomePageProps> = async () => {
    const [categories, popularProducts] = await Promise.all([
        getAllCategories(),
        getPopularProducts(),
    ]);

    if (categories.ok === false || categories.data === null) {
        throw new Error('Error fetching categories');
    }

    if (popularProducts.ok === false || popularProducts.data === null) {
        throw new Error('Error fetching popular products');
    }

    return {
        props: {
            categories: categories.data.categories,
            popularProducts: popularProducts.data.products,
        }
    };
};

interface HomePageProps {
    categories: CategoryList;
    popularProducts: ProductList;
}

export default HomePage;