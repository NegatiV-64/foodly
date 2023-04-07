import { Page } from '@/components/utility/Page';
import { withLayout } from '@/utils/withLayout.util';
import type { WithServerSideProps } from '@/utils/withServerSideProps.util';
import { withServerSideProps } from '@/utils/withServerSideProps.util';
import type { NextPage } from 'next';
import Table from '@mui/material/Table';
import Box from '@mui/material/Box';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import type { GetProductsQueryParams } from '@/api/products/get-products.api';
import { getProducts } from '@/api/products/get-products.api';
import { validateQueryParam } from '@/utils/validate-query-param.util';
import { ServerError } from '@/config/exceptions.config';
import Container from '@mui/material/Container';
import type { Product } from '@/interfaces/product.interface';
import { BackendImage } from '@/components/utility/BackendImage';
import Pagination from '@mui/material/Pagination';
import { countTotalPages } from '@/utils/count-total-pages.util';
import IconButton from '@mui/material/IconButton';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import Link from 'next/link';
import { colors } from '@/styles/theme';
import { useRouter } from 'next/router';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import TableContainer from '@mui/material/TableContainer';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import { Fragment, useState } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import type { ParsedUrlQueryInput } from 'querystring';
import type { SelectChangeEvent } from '@mui/material/Select';
import Select from '@mui/material/Select';
import { getCategories } from '@/api/categories/get-categories.api';
import type { SelectOption } from '@/interfaces/utility.interface';
import MenuItem from '@mui/material/MenuItem';
import { deleteSingleProduct } from '@/api/products/delete-single-product.api';

const ProductListPage: NextPage<ProductListPageProps> = ({ categoriesOptions, products, totalProducts }) => {
    // Router
    const { query, push } = useRouter();
    const searchQuery = validateQueryParam(query.search, 'string') ?? '';
    const currentPage = validateQueryParam(query.page, 'number') ?? 1;
    const categoryQuery = validateQueryParam(query.category, 'string') ?? 'all';

    // States
    const [search, setSearch] = useState<string>(searchQuery);

    // Handlers
    function onPaginationChangeHandler(_: unknown, page: number) {
        push({
            query: {
                ...query,
                page: page,
            }
        });
    }
    function onSearchChangeHandler(e: ChangeEvent<HTMLInputElement>) {
        setSearch(e.currentTarget.value.trimStart());
    }
    function onSearchHandler(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const queryObj: ParsedUrlQueryInput = {};

        if (search.trim().length > 0) {
            queryObj.search = search;
        }

        if (categoryQuery !== 'all') {
            queryObj.category = categoryQuery;
        }

        if (currentPage > 1) {
            queryObj.page = currentPage;
        }

        push({
            query: queryObj,
        });
    }
    function onChangeCategoryHandler(e: SelectChangeEvent<string>) {
        const queryObj: ParsedUrlQueryInput = {};

        if (e.target.value !== 'all') {
            queryObj.category = e.target.value;
        }

        if (search.trim().length > 0) {
            queryObj.search = search;
        }

        if (currentPage > 1) {
            queryObj.page = currentPage;
        }

        push({
            query: queryObj,
        });
    }
    async function onDeleteProductHandler(productId: number) {
        const { code, ok, data } = await deleteSingleProduct(productId);

        if (ok === false || data === null) {
            alert(`Error while deleting product. Code: ${code}`);
        }

        push({
            query: { ...query }
        });
    }

    return (
        <Page title='List of products'>
            <Box
                py={3}
                component={'section'}
            >
                <Container>
                    <Box
                        component={'div'}
                        display={'flex'}
                        justifyContent={'space-between'}
                    >
                        <Typography
                            component={'h2'}
                            variant={'h2'}
                            fontWeight={'medium'}
                            textAlign={'center'}
                        >
                            List of products
                        </Typography>
                        <Button
                            component={Link}
                            href='/products/add'
                            variant='contained'
                            startIcon={<AddIcon />}
                        >
                            Add Product
                        </Button>
                    </Box>
                    <TableContainer
                        sx={{
                            mt: 3,
                            bgcolor: colors.gray[900],
                            borderRadius: 2,
                            px: 3,
                            py: 2,
                        }}
                    >
                        <Box
                            component={'div'}
                            display={'flex'}
                            columnGap={2}
                            mb={2}
                        >
                            <Box
                                component={'form'}
                                onSubmit={onSearchHandler}
                            >
                                <TextField
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchIcon
                                                    sx={{
                                                        color: colors.gray[500],
                                                    }}
                                                />
                                            </InputAdornment>
                                        )
                                    }}
                                    placeholder='Search...'
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2,
                                        },
                                        '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                            borderColor: colors.forest[500],
                                        }
                                    }}
                                    size='small'
                                    value={search}
                                    onChange={onSearchChangeHandler}
                                />
                            </Box>
                            <Select
                                onChange={onChangeCategoryHandler}
                                size='small'
                                defaultValue={categoryQuery}
                                sx={{
                                    borderRadius: 2,
                                    color: colors.white,
                                    bgcolor: colors.transparent,
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        borderColor: colors.gray[500],
                                        transition: '0.2s',
                                        borderWidth: '1px'
                                    },
                                    '& .MuiSelect-icon': {
                                        color: colors.white,
                                    },
                                    '& .MuiOutlinedInput-notchedOutline.Mui-focused': {
                                        borderColor: colors.forest[500],
                                    },
                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                        borderColor: colors.gray[300],
                                    },
                                }}
                                MenuProps={{
                                    sx: {
                                        '& .MuiPaper-root': {
                                            bgcolor: colors.gray[900],
                                            color: colors.gray[100],
                                        },
                                        // on hover
                                        '& .MuiMenuItem-root': {
                                            '&:hover': {
                                                bgcolor: colors.forest[600],
                                            }
                                        }
                                    }
                                }}
                            >
                                {
                                    categoriesOptions.map((category) => (
                                        <MenuItem
                                            key={category.value}
                                            value={category.value}
                                        >
                                            {category.label}
                                        </MenuItem>
                                    ))
                                }
                            </Select>
                        </Box>
                        {
                            products.length > 0 ?
                                <Fragment>
                                    <Table>
                                        <TableHead
                                            sx={{
                                                bgcolor: colors.gray[800],
                                                border: 0,
                                            }}
                                        >
                                            <TableRow>
                                                <TableCell sx={{ border: 0 }} align='center'>Product ID</TableCell>
                                                <TableCell sx={{ border: 0 }} align='center'>Product Image</TableCell>
                                                <TableCell sx={{ border: 0 }} align='center'>Product Name</TableCell>
                                                <TableCell sx={{ border: 0 }} align='center'>Product Price</TableCell>
                                                <TableCell sx={{ border: 0 }} align='center'>Category Name</TableCell>
                                                <TableCell sx={{ border: 0 }} align='center'>Actions</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {
                                                products.map((product) => (
                                                    <TableRow
                                                        key={product.product_id}
                                                        sx={{
                                                            // on hover
                                                            '&:hover': {
                                                                bgcolor: colors.slate[800],
                                                                transition: 'background-color 0.1s'
                                                            },
                                                        }}
                                                    >
                                                        <TableCell
                                                            sx={{
                                                                borderBottomColor: colors.gray[400],
                                                            }}
                                                            align='center'
                                                        >
                                                            {product.product_id}
                                                        </TableCell>
                                                        <TableCell
                                                            sx={{
                                                                borderBottomColor: colors.gray[400],
                                                            }}
                                                            align='center'
                                                        >
                                                            <BackendImage
                                                                src={product.product_image}
                                                                alt={product.product_name}
                                                                width={50}
                                                                height={50}
                                                                style={{
                                                                    objectFit: 'cover'
                                                                }}
                                                            />
                                                        </TableCell>
                                                        <TableCell
                                                            sx={{
                                                                borderBottomColor: colors.gray[400],
                                                            }}
                                                            align='center'
                                                        >
                                                            {product.product_name}
                                                        </TableCell>
                                                        <TableCell
                                                            sx={{
                                                                borderBottomColor: colors.gray[400],
                                                            }}
                                                            align='center'
                                                        >
                                                            {product.product_price}</TableCell>
                                                        <TableCell
                                                            sx={{
                                                                borderBottomColor: colors.gray[400],
                                                            }}
                                                            align='center'
                                                        >
                                                            {product.category.category_name}</TableCell>
                                                        <TableCell
                                                            sx={{
                                                                borderBottomColor: colors.gray[400],
                                                            }}
                                                            align='center'
                                                        >
                                                            <IconButton
                                                                size='small'
                                                                sx={{
                                                                    bgcolor: colors.blue[600],
                                                                    color: colors.white,
                                                                    mr: 1
                                                                }}
                                                                LinkComponent={Link}
                                                                href={`/products/${product.product_id}`}
                                                            >
                                                                <VisibilityIcon />
                                                            </IconButton>
                                                            <IconButton
                                                                onClick={() => onDeleteProductHandler(product.product_id)}
                                                                size='small'
                                                                sx={{
                                                                    bgcolor: colors.red[600],
                                                                    color: colors.white,
                                                                }}
                                                            >
                                                                <DeleteIcon />
                                                            </IconButton>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            }
                                        </TableBody>
                                    </Table>
                                    <Pagination
                                        page={currentPage}
                                        sx={{
                                            mt: 5,
                                            display: 'flex',
                                            justifyContent: 'center'
                                        }}
                                        onChange={onPaginationChangeHandler}
                                        size='large'
                                        count={countTotalPages(totalProducts)}
                                        color='primary'
                                        shape='rounded'
                                    />
                                </Fragment>
                                :
                                <Typography
                                    component={'h3'}
                                    variant={'h3'}
                                    textAlign={'center'}
                                    pt={2}
                                    pb={2}
                                >
                                    No products found
                                </Typography>
                        }

                    </TableContainer>
                </Container>
            </Box>
        </Page>
    );
};


export const getServerSideProps: WithServerSideProps<ProductListPageProps> = withServerSideProps(async (context) => {
    const pageNumQuery = validateQueryParam(context.query.page, 'number', {
        defaultValue: 1,
    }) ?? 1;
    const categorySlugQuery = validateQueryParam(context.query.category, 'string', {
        defaultValue: 'all',
    }) ?? '';
    const searchQuery = validateQueryParam(context.query.search, 'string') ?? '';
    const orderQuery = validateQueryParam(context.query.order, 'string', {
        defaultValue: 'asc',
        possibleValues: ['asc', 'desc'],
    }) ?? 'desc';
    const sortQuery = validateQueryParam(context.query.sort, 'string', {
        defaultValue: 'price',
        possibleValues: ['product_id', 'product_name', 'product_price', 'category_name', 'category_id']
    }) ?? 'product_id';

    const productsResponse = await getProducts({
        page: pageNumQuery,
        category: categorySlugQuery,
        search: searchQuery,
        order: orderQuery as GetProductsQueryParams['order'],
        sort: sortQuery as GetProductsQueryParams['sort'],
    });

    if (productsResponse.ok === false || productsResponse.data === null) {
        throw new ServerError(productsResponse.code, 'Error while fetching products');
    }

    const categoriesResponse = await getCategories();
    if (categoriesResponse.ok === false || categoriesResponse.data === null) {
        throw new ServerError(categoriesResponse.code, 'Error while fetching categories');
    }

    const categoriesOptions = categoriesResponse.data.categories.map((category) => ({
        value: category.category_slug,
        label: category.category_name,
    }));

    return {
        props: {
            products: productsResponse.data.products,
            totalProducts: productsResponse.data.total,
            categoriesOptions: [...categoriesOptions, { value: 'all', label: 'All' }],
        }
    };
});

interface ProductListPageProps {
    products: Product[];
    totalProducts: number;
    categoriesOptions: SelectOption[];
}

export default withLayout(ProductListPage);