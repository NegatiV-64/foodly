import { getProducts } from '@/api/products/getProducts.api';
import { BaseInput } from '@/components/form/BaseInput';
import { Pagination } from '@/components/navigation/Pagination';
import { Container } from '@/components/ui/Container';
import { Heading } from '@/components/ui/Heading';
import { ProductCard } from '@/components/ui/ProductCard';
import { Section } from '@/components/ui/Section';
import { Text } from '@/components/ui/Text';
import { Page } from '@/components/utility/Page';
import { ServerError } from '@/exceptions/server-error.exception';
import type { Product } from '@/types/product.types';
import { countTotalPages } from '@/utils/count-total-pages.util';
import { queryBuilder } from '@/utils/query-builder.util';
import { validateQueryParam } from '@/utils/validate-query-param.util';
import { withServerSideProps } from '@/utils/with-server-side-props.util';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import { Fragment } from 'react';
import { useForm } from 'react-hook-form';

const MenuPage: FC<MenuPageProps> = ({ pagesAmount, products }) => {
    // ==== Router ==== //
    const { query, push } = useRouter();
    const activePage = validateQueryParam(query?.page, 'number');
    const searchQuery = validateQueryParam(query?.search, 'string') ?? '';

    // ==== Pagination ==== //
    function createPaginationHref(page: number) {
        const query = queryBuilder('/menu', {
            query: 'page',
            value: page,
            default: 1,
        }, {
            query: 'search',
            value: searchQuery,
        });

        return query;
    }

    // ==== Search ==== //
    const { register, handleSubmit } = useForm<SearchFormFields>();
    function onSearchSubmit(formValues: SearchFormFields) {
        const searchQuery = formValues.search;

        const query = queryBuilder('/menu', {
            query: 'search',
            value: searchQuery,
        });

        push(query);
    }

    return (
        <Page title={`List of products - Page ${activePage ?? 1}`}>
            <Section>
                <Container>
                    <div
                        className='mb-7 flex items-center justify-between'
                    >
                        <Heading size='4xl' className='text-center'>
                            List of Products
                        </Heading>
                        <form onSubmit={handleSubmit(onSearchSubmit)}>
                            <BaseInput
                                type="search"
                                id="search"
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
                                placeholder="Type to search..."
                                defaultValue={searchQuery}
                                {...register('search')}
                            />
                        </form>
                    </div>
                    {
                        products.length > 0 ?
                            <Fragment>
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
                                    activePage={activePage ?? 1}
                                    pageCount={pagesAmount}
                                    hrefGenerator={createPaginationHref}
                                />
                            </Fragment>
                            :
                            <div className='flex flex-col gap-y-3 text-center'>
                                <Heading size='2xl'>
                                    No products found
                                </Heading>
                                <Text size='lg' className='text-gray-500'>
                                    {searchQuery && searchQuery.length > 0
                                        ? 'Try to change your search query.'
                                        : 'Sorry, but we couldn\'t find any products.'
                                    }
                                </Text>
                            </div>
                    }
                </Container>
            </Section>
        </Page>
    );
};

export const getServerSideProps = withServerSideProps(async (context) => {
    const activePage = validateQueryParam(context.query?.page, 'number') ?? 1;
    const search = validateQueryParam(context.query?.search, 'string') ?? '';

    const productsResponse = await getProducts({
        page: activePage,
        search: search,
    });

    if (productsResponse.ok === false || productsResponse.data === null) {
        throw new ServerError(productsResponse.code, `Error while retrieving products. Information: ${productsResponse.error}`);
    }

    const products = productsResponse.data.products;
    const pagesAmount = countTotalPages(productsResponse.data.total);

    return {
        props: {
            products,
            pagesAmount,
        }
    };
});

interface MenuPageProps {
    products: Product[];
    pagesAmount: number;
}

interface SearchFormFields {
    search: string;
}

export default MenuPage;