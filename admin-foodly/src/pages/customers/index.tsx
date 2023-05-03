import type { GetCustomersQueryParams } from '@/api/customers/get-customers.api';
import { getCustomers } from '@/api/customers/get-customers.api';
import { Page } from '@/components/utility/Page';
import { ServerError } from '@/config/exceptions.config';
import type { User } from '@/interfaces/user.interface';
import { validateQueryParam } from '@/utils/validate-query-param.util';
import { withLayout } from '@/utils/withLayout.util';
import { withServerSideProps } from '@/utils/withServerSideProps.util';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
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
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import { orderOptions } from '@/config/options.config';
import EditIcon from '@mui/icons-material/Edit';
import { countTotalPages } from '@/utils/count-total-pages.util';

const sortCustomerOptions = [
    {
        label: 'User ID',
        value: 'user_id',
    },
    {
        label: 'Email',
        value: 'user_email',
    },
    {
        label: 'Last name',
        value: 'user_lastname',
    }
];

export const CustomersPage: NextPage<CustomersPageProps> = ({ customers, totalCustomers }) => {
    // Router
    const { push, query } = useRouter();
    const pageQuery = validateQueryParam(query.page, 'number', { defaultValue: 1, });
    const orderQuery = validateQueryParam(query.order, 'string', { possibleValues: ['asc', 'desc'], defaultValue: 'desc', });
    const sortQuery = validateQueryParam(query.sort, 'string', { possibleValues: ['user_id', 'user_email', 'user_lastname'], defaultValue: 'user_id', });
    const searchQuery = validateQueryParam(query.search, 'string');

    // Pagination
    function onPageChange(_: unknown, page: number) {
        push({
            query: {
                ...query,
                page,
            },
        });
    }

    // Filtering
    const { register, handleSubmit } = useForm<CustomersPageFilterFormFields>();
    function onFilter(formValues: CustomersPageFilterFormFields) {
        const queryParams: Record<string, string> = {};

        if (formValues.search && formValues.search.trim().length > 0) {
            queryParams.search = formValues.search;
        }

        if (formValues.sort && formValues.sort !== 'user_id') {
            queryParams.sort = formValues.sort;
        }

        if (formValues.order && formValues.order !== 'desc') {
            queryParams.order = formValues.order;
        }

        if (pageQuery) {
            queryParams.page = pageQuery.toString();
        }

        push({
            query: queryParams,
        });
    }

    return (
        <Page title='Customers'>
            <Box
                component={'section'}
                py={3}
            >
                <Container>
                    <Typography
                        variant={'h2'}
                        component={'h2'}
                    >
                        List of customers
                    </Typography>
                    <TableContainer
                        sx={{
                            mt: 3,
                        }}
                    >
                        <Box
                            display={'flex'}
                            columnGap={2}
                            mb={2}
                            component={'form'}
                            onSubmit={handleSubmit(onFilter)}
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
                                defaultValue={searchQuery ?? ''}
                                {...register('search')}
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
                                defaultValue={sortQuery ?? 'user_id'}
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
                                    sortCustomerOptions.map((item) => {
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
                            <TableHead>
                                <TableRow>
                                    <TableCell>
                                        ID
                                    </TableCell>
                                    <TableCell>
                                        Email
                                    </TableCell>
                                    <TableCell>
                                        Last name
                                    </TableCell>
                                    <TableCell>
                                        First name
                                    </TableCell>
                                    <TableCell>
                                        Phone
                                    </TableCell>
                                    <TableCell>
                                        Address
                                    </TableCell>
                                    <TableCell>
                                        Is Verified
                                    </TableCell>
                                    <TableCell>
                                        Actions
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    customers.map((customer) => (
                                        <TableRow
                                            key={customer.user_id}
                                        >
                                            <TableCell>
                                                {customer.user_id}
                                            </TableCell>
                                            <TableCell>
                                                {customer.user_email}
                                            </TableCell>
                                            <TableCell>
                                                {customer.user_lastname ?? 'N/A'}
                                            </TableCell>
                                            <TableCell>
                                                {customer.user_firstname ?? 'N/A'}
                                            </TableCell>
                                            <TableCell>
                                                {customer.user_phone}
                                            </TableCell>
                                            <TableCell>
                                                {customer.user_address ?? 'N/A'}
                                            </TableCell>
                                            <TableCell>
                                                {customer.user_is_verified ? 'Yes' : 'No'}
                                            </TableCell>
                                            <TableCell>
                                                <IconButton
                                                    size='small'
                                                    sx={{
                                                        bgcolor: colors.blue[500],
                                                        mr: 1,
                                                    }}
                                                    LinkComponent={Link}
                                                    href={`/customers/${customer.user_id}/edit`}
                                                >
                                                    <EditIcon />
                                                </IconButton>
                                                <IconButton
                                                    size='small'
                                                    sx={{
                                                        bgcolor: colors.forest[500],
                                                    }}
                                                    LinkComponent={Link}
                                                    href={`/customers/${customer.user_id}`}
                                                >
                                                    <VisibilityIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Pagination
                        onChange={onPageChange}
                        page={pageQuery ?? 1}
                        count={countTotalPages(totalCustomers)}
                        size='large'
                        color='primary'
                        shape='rounded'
                        sx={{
                            mt: 5,
                            display: 'flex',
                            justifyContent: 'center'
                        }}
                    />
                </Container>
            </Box>
        </Page>
    );
};

export const getServerSideProps = withServerSideProps<CustomersPageProps>(async (context) => {
    const pageQuery = validateQueryParam(context.query.page, 'number') ?? 1;
    const orderQuery = validateQueryParam(context.query.order, 'string', { possibleValues: ['asc', 'desc'], }) ?? 'asc';
    const sortQuery = validateQueryParam(context.query.sort, 'string', { possibleValues: ['user_id', 'user_email', 'user_lastname'], }) ?? 'user_id';
    const searchQuery = validateQueryParam(context.query.search, 'string') ?? '';

    const getCustomersQueryParams: GetCustomersQueryParams = {
        page: pageQuery,
        order: orderQuery as 'asc' | 'desc',
        sort: sortQuery as GetCustomersQueryParams['sort'],
        search: searchQuery,
    };

    const { code, data, ok } = await getCustomers(getCustomersQueryParams, context);

    if (ok === false || data === null) {
        throw new ServerError(code, 'Error while fetching customers.');
    }

    return {
        props: {
            totalCustomers: data.total,
            customers: data.users,
        },
    };
});

interface CustomersPageProps {
    totalCustomers: number;
    customers: User[];
}

interface CustomersPageFilterFormFields {
    search?: string;
    sort?: GetCustomersQueryParams['sort'];
    order?: GetCustomersQueryParams['order'];
}

export default withLayout(CustomersPage);