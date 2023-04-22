import type { NextPage } from 'next';
import { getAllCategories } from '@/api/categories/getAllCategories.api';
import { getLatestProducts } from '@/api/products/getLatestProducts.api';
import { Page } from '@/components/utility/Page';
import type { CategoryList } from '@/types/category.types';
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
import type { ProductList } from '@/types/product.types';
import { ProductCard } from '@/components/ui/ProductCard';
import { HiArrowRight, HiOutlineClock, HiOutlineFire, HiOutlineMail, HiOutlinePhone, HiOutlineTruck } from 'react-icons/hi';
import { Button } from '@/components/ui/Button';
import { Link } from '@/components/navigation/Link';
import { ServerError } from '@/exceptions/server-error.exception';
import { withServerSideProps } from '@/utils/with-server-side-props.util';
import { useForm } from 'react-hook-form';
import { Section } from '@/components/ui/Section';
import { InputField } from '@/components/form/InputField';
import { TextAreaField } from '@/components/form/TextareaField';

const HomePage: NextPage<HomePageProps> = ({ categories, latestProducts }) => {
    const { register } = useForm<ContactFormFields>();

    return (
        <Page title='Home'>
            <Section className='flex items-center'>
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
                            latestProducts.map((product) => (
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
                        <InputField
                            type='text'
                            id='full-name'
                            placeholder='Full name'
                            autoComplete='full-name'
                            required={true}
                            {...register('fullname')}
                        />
                        <InputField
                            type='email'
                            id='email'
                            placeholder='Email address'
                            autoComplete='email'
                            required={true}
                            {...register('email')}
                        />
                        <TextAreaField
                            id='message'
                            placeholder='Message'
                            required={true}
                            rows={4}
                            defaultValue={''}
                            {...register('message')}
                        />
                        <Button type='submit'>
                            Submit
                        </Button>
                    </form>
                </Container>
            </Section>
        </Page>
    );
};

export const getServerSideProps = withServerSideProps<HomePageProps>(async () => {
    const [categoriesResponse, latestProductsResponse] = await Promise.all([
        getAllCategories(),
        getLatestProducts(),
    ]);

    if (categoriesResponse.ok === false || categoriesResponse.data === null) {
        throw new ServerError(categoriesResponse.code, `Error happened while retrieving categories. Information: ${categoriesResponse.error}`);
    }

    if (latestProductsResponse.ok === false || latestProductsResponse.data === null) {
        throw new ServerError(latestProductsResponse.code, `Error happened while retrieving latest products. Information: ${latestProductsResponse.error}`);
    }

    const categories = categoriesResponse.data.categories;
    const latestProducts = latestProductsResponse.data.products;

    return {
        props: {
            categories,
            latestProducts,
        }
    };
});

interface HomePageProps {
    categories: CategoryList;
    latestProducts: ProductList;
}

interface ContactFormFields {
    fullname: string;
    email: string;
    message: string;
}

export default HomePage;