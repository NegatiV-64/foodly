import { getSingleProduct } from '@/api/products/get-single-product.api';
import { BackendImage } from '@/components/utility/BackendImage';
import { Page } from '@/components/utility/Page';
import { ServerError } from '@/config/exceptions.config';
import type { Product } from '@/interfaces/product.interface';
import { colors } from '@/styles/theme';
import { validateQueryParam } from '@/utils/validate-query-param.util';
import { withLayout } from '@/utils/withLayout.util';
import { withServerSideProps } from '@/utils/withServerSideProps.util';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import type { NextPage } from 'next';
import Link from 'next/link';

const ViewProductPage: NextPage<ViewProductPageProps> = ({ product }) => {
    return (
        <Page title={`Viewing ${product.product_name}`}>
            <Box
                component={'section'}
                py={3}
            >
                <Container
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                    }}
                >
                    <Box>
                        <BackendImage
                            src={product.product_image}
                            alt={product.product_name}
                            width={400}
                            height={400}
                            style={{
                                objectFit: 'contain',
                                backgroundColor: colors.gray[500]
                            }}
                        />
                    </Box>
                    <Box>
                        <Box
                            display={'flex'}
                            justifyContent={'space-between'}
                            rowGap={2}
                        >
                            <Typography
                                component={'h2'}
                                variant='h1'
                                fontWeight={'bold'}
                                mb={2}
                            >
                                {product.product_name}
                            </Typography>
                            <Button
                                LinkComponent={Link}
                                href={`/products/${product.product_id}/edit`}
                                sx={{
                                    height: 'fit-content',
                                }}
                                variant='contained'
                            >
                                Edit Product
                            </Button>
                        </Box>
                        <Typography
                            component={'p'}
                            variant='h4'
                            fontWeight={400}
                            mb={2}
                        >
                            Description: {' '}
                            {product.product_description}
                        </Typography>
                        <Typography
                            component={'p'}
                            variant='h4'
                            fontWeight={400}
                            mb={2}
                        >
                            Price: {' '}
                            {product.product_price} soms
                        </Typography>
                        <Typography
                            component={'p'}
                            variant='h4'
                            fontWeight={400}
                            mb={2}
                        >
                            Category: {' '}
                            {product.category.category_icon} {' '}
                            {product.category.category_name}
                        </Typography>
                    </Box>
                </Container>
            </Box>
        </Page>
    );
};

export const getServerSideProps = withServerSideProps<ViewProductPageProps>(async (context) => {
    const productId = validateQueryParam(context.query.productId, 'number');

    if (productId === null) {
        return {
            notFound: true,
        };
    }

    const { code, data: product, ok } = await getSingleProduct(productId);
    if (ok === false || product === null) {
        throw new ServerError(code, 'Failed to get product');
    }

    return {
        props: {
            product: product,
        },
    };
});

interface ViewProductPageProps {
    product: Product;
}

export default withLayout(ViewProductPage);