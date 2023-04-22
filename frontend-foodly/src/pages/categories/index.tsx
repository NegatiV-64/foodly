import { getAllCategories } from '@/api/categories/getAllCategories.api';
import { Container } from '@/components/ui/Container';
import { Heading } from '@/components/ui/Heading';
import { Page } from '@/components/utility/Page';
import type { CategoryList } from '@/types/category.types';
import type { NextPage } from 'next';
import Link from 'next/link';
import { RoutesConfig } from '@/config/routes.config';
import { Section } from '@/components/ui/Section';
import { withServerSideProps } from '@/utils/with-server-side-props.util';
import { ServerError } from '@/exceptions/server-error.exception';

const CategoriesPage: NextPage<CategoriesPageProps> = ({ categories }) => {
    return (
        <Page title='Food Categories'>
            <Section>
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
            </Section>
        </Page>
    );
};

export const getServerSideProps = withServerSideProps<CategoriesPageProps>(async () => {
    const { code, data, error, ok } = await getAllCategories();
    if (data === null || ok === false) {
        throw new ServerError(code, `Error happened while retrieving categories. Information: ${error}`);
    }

    return {
        props: {
            categories: data.categories,
        }
    };
});

interface CategoriesPageProps {
    categories: CategoryList;
}

export default CategoriesPage;