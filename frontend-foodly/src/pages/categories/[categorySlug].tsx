import { getCategory } from '@/api/categories/getCategory.api';
import { getProductsByCategory } from '@/api/products/getProductsByCategory.api';
import { Pagination } from '@/components/navigation/Pagination';
import { Container } from '@/components/ui/Container';
import { Heading } from '@/components/ui/Heading';
import { ProductCard } from '@/components/ui/ProductCard';
import { Section } from '@/components/ui/Section';
import { Page } from '@/components/utility/Page';
import { ServerError } from '@/exceptions/server-error.exception';
import type { Category } from '@/types/category.types';
import type { ProductList } from '@/types/product.types';
import { countTotalPages } from '@/utils/count-total-pages.util';
import { queryBuilder } from '@/utils/query-builder.util';
import { validateQueryParam } from '@/utils/validate-query-param.util';
import { withServerSideProps } from '@/utils/with-server-side-props.util';
import type { NextPage } from 'next';

const CategoryPage: NextPage<CategoryPageProps> = ({ category, activePage, products, totalProducts }) => {
    function createPaginationHref(page: number) {
        const query = queryBuilder(`/categories/${category.category_slug}`, {
            query: 'page',
            value: page,
        });

        return query;
    }

    return (
        <Page title={`${category.category_name}`}>
            <Section>
                <Container>
                    <Heading size='4xl' className='mb-7 text-center'>
                        {category.category_icon} {category.category_name}
                    </Heading>
                    <div className='grid grid-cols-4 gap-7'>
                        {
                            products.map((product) => {
                                return (
                                    <ProductCard
                                        key={product.product_id}
                                        product={product}
                                    />
                                );
                            })
                        }
                    </div>
                    <Pagination
                        className='mt-10'
                        activePage={activePage}
                        pageCount={countTotalPages(totalProducts)}
                        hrefGenerator={createPaginationHref}
                    />
                </Container>
            </Section>
        </Page>
    );
};

export const getServerSideProps = withServerSideProps<CategoryPageProps>(async (context) => {
    const categorySlug = validateQueryParam(context.params?.categorySlug, 'string');
    if (categorySlug === null) {
        throw new ServerError(404, 'Category not found');
    }

    const activePage = validateQueryParam(context.query?.page, 'number') ?? 1;
    const search = validateQueryParam(context.query?.search, 'string') ?? '';
    const { data, ok, code, error } = await getProductsByCategory(categorySlug, activePage);

    if (data === null || ok === false) {
        throw new ServerError(code, `Error happened while retrieving products. Information: ${error}`);
    }

    const { products, total } = data;
    let category = data.products.at(0)?.category as Category | undefined;

    if (category === undefined) {
        const categoryResponse = await getCategory(categorySlug);
        if (categoryResponse.data === null || categoryResponse.ok === false) {
            throw new ServerError(categoryResponse.code, `Error happened while retrieving category. Information: ${categoryResponse.error}`);
        }

        category = categoryResponse.data;
    }

    return {
        props: {
            category: category,
            products: products,
            totalProducts: total,
            activePage: activePage,
            search: search,
        },
    };
});

interface CategoryPageProps {
    category: Category;
    products: ProductList;
    totalProducts: number;
    activePage: number;
    search: string;
}

export default CategoryPage;