import { getAllCategories } from '@/api/categories/getAllCategories.api';
import { getPopularProducts } from '@/api/products/getPopularProducts.api';
import { Page } from '@/components/utility/Page';
import type { CategoryList } from '@/interfaces/category.interface';
import type { ProductList } from '@/interfaces/product.inteface';
import { Home } from '@/modules/Home/Home';
import type { GetServerSideProps, NextPage } from 'next';

const HomePage: NextPage<HomePageProps> = ({ categories, popularProducts }) => {
    return (
        <Page title='Home'>
            <Home
                categories={categories}
                popularProducts={popularProducts}
            />
        </Page>
    );
};

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
    popularProducts: ProductList
}

export default HomePage;