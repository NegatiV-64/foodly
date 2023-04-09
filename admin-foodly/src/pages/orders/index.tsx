import type { GetOrdersQueryParams, GetOrdersResponse } from '@/api/orders/get-orders.api';
import { getOrders } from '@/api/orders/get-orders.api';
import { Page } from '@/components/utility/Page';
import { ServerError } from '@/config/exceptions.config';
import { validateQueryParam } from '@/utils/validate-query-param.util';
import { withLayout } from '@/utils/withLayout.util';
import { withServerSideProps } from '@/utils/withServerSideProps.util';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableContainer from '@mui/material/TableContainer';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Pagination from '@mui/material/Pagination';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Link from 'next/link';
import { colors } from '@/styles/theme';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import IconButton from '@mui/material/IconButton';
import { Time } from '@/utils/dayjs.util';
import { orderOptions, sortOrdersOptions } from '@/config/options.config';
import { countTotalPages } from '@/utils/count-total-pages.util';
import { useForm } from 'react-hook-form';
import type { ParsedUrlQuery } from 'querystring';
import Button from '@mui/material/Button';

const OrdersPage: NextPage<OrdersPageProps> = ({ orders, totalOrders }) => {
    // Form
    const { handleSubmit, register } = useForm<OrdersPageFilters>();

    // Router
    const { query, push } = useRouter();
    const pageQuery = validateQueryParam(query.page, 'number', {
        defaultValue: 1,
    });
    const createdAtQuery = validateQueryParam(query.created_at, 'string');
    const orderQuery = validateQueryParam(query.order, 'string', {
        possibleValues: orderOptions.map((option) => option.value),
        defaultValue: 'desc',
    });
    const customerQuery = validateQueryParam(query.customer, 'string') ?? '';
    const sortQuery = validateQueryParam(query.sort, 'string', {
        possibleValues: sortOrdersOptions.map((option) => option.value),
        defaultValue: 'order_created_at',
    });

    // Handlers
    function onPaginationChangeHandler(_: unknown, page: number) {
        push({
            query: {
                ...query,
                page: page,
            }
        });
    }
    function onFiltersChangeHandler(formValues: OrdersPageFilters) {
        const queryParams: ParsedUrlQuery = {};

        if (formValues.created_at && formValues.created_at.length > 0) {
            if (Time(formValues.created_at).isValid()) {
                const formattedDate = Time(formValues.created_at).format('DD-MM-YYYY');
                queryParams.created_at = formattedDate;
            }
        }

        if (formValues.customer && formValues.customer.length > 0) {
            queryParams.customer = formValues.customer;
        }

        if (formValues.order && formValues.order !== 'desc') {
            queryParams.order = formValues.order;
        }

        if (formValues.sort && formValues.sort !== 'order_created_at') {
            queryParams.sort = formValues.sort;
        }

        if (pageQuery && pageQuery !== 1) {
            queryParams.page = `${pageQuery}`;
        }

        push({
            query: queryParams,
        });
    }

    return (
        <Page title="Orders">
            <Box
                component={'section'}
                py={3}
            >
                <Container>
                    <Typography
                        variant={'h2'}
                        component={'h2'}
                    >
                        List of orders
                    </Typography>
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
                            display={'flex'}
                            columnGap={2}
                            mb={2}
                            component={'form'}
                            onSubmit={handleSubmit(onFiltersChangeHandler)}
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
                                placeholder='Search by customer...'
                                variant="outlined"
                                size="small"
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2,
                                    },
                                    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                        borderColor: colors.forest[500],
                                    }
                                }}
                                defaultValue={customerQuery}
                                {...register('customer')}
                            />
                            <TextField
                                type='date'
                                variant="outlined"
                                size="small"
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2,
                                    },
                                    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                        borderColor: colors.forest[500],
                                    }
                                }}
                                defaultValue={createdAtQuery}
                                {...register('created_at')}
                            />
                            <Select
                                size='small'
                                defaultValue={orderQuery ?? 'desc'}
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
                                {...register('order')}
                            >
                                {
                                    orderOptions.map((category) => (
                                        <MenuItem
                                            key={category.value}
                                            value={category.value}
                                        >
                                            {category.label}
                                        </MenuItem>
                                    ))
                                }
                            </Select>
                            <Select
                                size='small'
                                defaultValue={sortQuery ?? 'order_created_at'}
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
                                {...register('sort')}
                            >
                                {
                                    sortOrdersOptions.map((item) => {
                                        return (
                                            <MenuItem
                                                key={item.value}
                                                value={item.value}
                                            >
                                                {item.label}
                                            </MenuItem>
                                        );
                                    })
                                }
                            </Select>
                            <Button
                                type='submit'
                                variant='contained'
                            >
                                Filter
                            </Button>
                        </Box>
                        <Table>
                            <TableHead
                                sx={{
                                    bgcolor: colors.gray[800],
                                    border: 0,
                                }}
                            >
                                <TableRow>
                                    {/* "order_id" | "order_created_at" | "order_price" | "order_status" | "order_user_id" | "order_delivery_id" */}
                                    <TableCell sx={{ border: 0 }} align='center'>Created at</TableCell>
                                    <TableCell sx={{ border: 0 }} align='center'>Customer ID</TableCell>
                                    <TableCell sx={{ border: 0 }} align='center'>Price</TableCell>
                                    <TableCell sx={{ border: 0 }} align='center'>Status</TableCell>
                                    <TableCell sx={{ border: 0 }} align='center'>Delivery ID</TableCell>
                                    <TableCell sx={{ border: 0 }} align='center'>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    orders.map((order) => (
                                        <TableRow
                                            key={order.order_id}
                                            sx={{
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
                                                {Time(order.order_created_at, 'YYYY-MM-DDTHH:mm:ss.0000').format('DD/MM/YYYY HH:mm')}</TableCell>
                                            <TableCell
                                                sx={{
                                                    borderBottomColor: colors.gray[400],
                                                }}
                                                align='center'
                                            >
                                                {order.order_user_id}</TableCell>
                                            <TableCell
                                                sx={{
                                                    borderBottomColor: colors.gray[400],
                                                }}
                                                align='center'
                                            >
                                                {order.order_price}
                                            </TableCell>
                                            <TableCell
                                                sx={{
                                                    borderBottomColor: colors.gray[400],
                                                }}
                                                align='center'
                                            >
                                                {order.order_status}
                                            </TableCell>
                                            <TableCell
                                                sx={{
                                                    borderBottomColor: colors.gray[400],
                                                }}
                                                align='center'
                                            >
                                                {order.order_delivery_id ?? 'Not assigned'}
                                            </TableCell>
                                            <TableCell
                                                sx={{
                                                    borderBottomColor: colors.gray[400],
                                                }}
                                                align='center'

                                            >
                                                <IconButton
                                                    sx={{
                                                        bgcolor: colors.blue[600],
                                                        color: colors.white,
                                                        mr: 1
                                                    }}
                                                    LinkComponent={Link}
                                                    href={`/orders/${order.order_id}`}
                                                >
                                                    <VisibilityIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                }
                            </TableBody>
                        </Table>
                        <Pagination
                            onChange={onPaginationChangeHandler}
                            page={pageQuery ?? 1}
                            count={countTotalPages(totalOrders)}
                            size='large'
                            color='primary'
                            shape='rounded'
                            sx={{
                                mt: 5,
                                display: 'flex',
                                justifyContent: 'center'
                            }}
                        />
                    </TableContainer>
                </Container>
            </Box>
        </Page>
    );
};

export const getServerSideProps = withServerSideProps(async (context) => {
    const pageQuery = validateQueryParam(context.query.page, 'number') ?? 1;
    const createdAtQuery = validateQueryParam(context.query.created_at, 'string') ?? '';
    const orderQuery = validateQueryParam(context.query.order, 'string', {
        possibleValues: orderOptions.map((option) => option.value),
    }) ?? 'desc';
    const sortQuery = validateQueryParam(context.query.sort, 'string', {
        possibleValues: sortOrdersOptions.map((option) => option.value),
    }) ?? 'order_created_at';
    const customerQuery = validateQueryParam(context.query.customer, 'string') ?? '';

    const ordersResponse = await getOrders({
        page: pageQuery,
        createdAt: createdAtQuery,
        order: orderQuery as 'asc' | 'desc',
        sort: sortQuery as GetOrdersQueryParams['sort'],
        user: customerQuery,
    }, context);

    if (ordersResponse.ok === false || ordersResponse.data === null) {
        throw new ServerError(ordersResponse.code, 'Failed to fetch orders.');
    }

    return {
        props: {
            totalOrders: ordersResponse.data.total,
            orders: ordersResponse.data.orders,
        }
    };
});

interface OrdersPageProps {
    totalOrders: number;
    orders: GetOrdersResponse['orders'];
}

interface OrdersPageFilters {
    created_at: string;
    order: 'asc' | 'desc';
    sort: GetOrdersQueryParams['sort'];
    customer: string;
}

export default withLayout(OrdersPage);