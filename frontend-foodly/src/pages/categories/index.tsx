import { getAllCategories } from '@/api/categories/getAllCategories.api';
import { Container } from '@/components/ui/Container';
import { Heading } from '@/components/ui/Heading';
import { Page } from '@/components/utility/Page';
import type { CategoryList } from '@/interfaces/category.interface';
import type { GetServerSideProps, NextPage } from 'next';
import Link from 'next/link';
import { RoutesConfig } from '@/config/routes.config';

const CategoriesPage: NextPage<CategoriesPageProps> = ({ categories }) => {
    return (
        <Page title='Food Categories'>
            <section className='py-9'>
                <Container>
                    <Heading as='h2' size='3xl' className='mb-8 text-center'>
                        Food Categories:
                    </Heading>
                    <div className='grid grid-cols-4 gap-9'>
                        {
                            categories.map((category) => (
                                <Link href={RoutesConfig.Category(category.category_slug)} key={category.category_id}>
                                    <article className='flex flex-col items-center justify-center rounded-lg bg-white pt-4 pb-5 shadow-sm duration-200 hover:shadow-md'>
                                        <span className='mb-3 text-5xl'>
                                            {category.category_icon}
                                        </span>
                                        <Heading as='h3' weight='normal' size='xl'>
                                            {category.category_name}
                                        </Heading>
                                    </article>
                                </Link>
                            ))
                        }
                    </div>
                </Container>
            </section>
        </Page>
    );
};

export const getServerSideProps: GetServerSideProps<CategoriesPageProps> = async () => {
    const categories = await getAllCategories();
    if (categories.data === null || categories.ok === false) {
        throw new Error('Failed to fetch all categories');
    }

    return {
        props: {
            categories: categories.data.categories
        }
    };
};

interface CategoriesPageProps {
    categories: CategoryList;
}

export default CategoriesPage;