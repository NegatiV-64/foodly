import { getCategory } from '@/api/categories/getCategory.api';
import { getProductsByCategory } from '@/api/products/getProductsByCategory.api';
import { Pagination } from '@/components/navigation/Pagination';
import { Container } from '@/components/ui/Container';
import { Heading } from '@/components/ui/Heading';
import { ProductCard } from '@/components/ui/ProductCard';
import { Page } from '@/components/utility/Page';
import type { Category } from '@/interfaces/category.interface';
import type { ProductList } from '@/interfaces/product.inteface';
import { countTotalPages } from '@/utils/countTotalPages.util';
import { queryBuilder } from '@/utils/queryBuilder.util';
import { validateDynamicUrlPart } from '@/utils/validateDynamicUrlPart.util';
import type { GetServerSideProps, NextPage } from 'next';

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
            <section className='py-10'>
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
            </section>
        </Page>
    );
};

export const getServerSideProps: GetServerSideProps<CategoryPageProps> = async (context) => {
    const categorySlug = validateDynamicUrlPart(context.params?.categorySlug, 'string');
    if (!categorySlug) {
        return {
            notFound: true,
        };
    }

    const activePage = validateDynamicUrlPart(context.query?.page, 'number') ?? 1;
    const search = validateDynamicUrlPart(context.query?.search, 'string') ?? '';
    const { data, ok } = await getProductsByCategory(categorySlug, activePage);

    if (data === null || ok === false) {
        // I know that this is not the best way to handle the error, but
        // I am lazy to do a better handling of the possible errors
        // Btw, my backend is bullerproof, so this error will never happen :)

        return {
            notFound: true,
        };
    }

    const { products, total } = data;
    let category = data.products.at(0)?.category as Category | undefined;

    if (category === undefined) {
        const { data: categoryData, ok: categoryOk } = await getCategory(categorySlug);
        if (categoryData === null || categoryOk === false) {
            return {
                notFound: true,
            };
        }

        category = categoryData;
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
};

interface CategoryPageProps {
    category: Category;
    products: ProductList;
    totalProducts: number;
    activePage: number;
    search: string;
}

export default CategoryPage;