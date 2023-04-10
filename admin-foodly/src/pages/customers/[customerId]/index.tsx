import type { GetSingleCustomerResponse } from '@/api/customers/get-single-customer.api';
import { getSingleCustomer } from '@/api/customers/get-single-customer.api';
import { ContentBlock } from '@/components/ui/ContentBlock';
import { ContentColumn } from '@/components/ui/ContentColumn';
import { ContentRow } from '@/components/ui/ContentRow';
import { Page } from '@/components/utility/Page';
import { ServerError } from '@/config/exceptions.config';
import { validateQueryParam } from '@/utils/validate-query-param.util';
import { withLayout } from '@/utils/withLayout.util';
import { withServerSideProps } from '@/utils/withServerSideProps.util';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import type { NextPage } from 'next';
import Table from '@mui/material/Table';
import TableContainer from '@mui/material/TableContainer';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

const CustomerPage: NextPage<CustomerPageProps> = ({ customer }) => {
    return (
        <Page title={`Viewing customer ${customer.user_id}`}>
            <Box
                component="section"
                py={3}
            >
                <Container>
                    <ContentRow
                        display={'grid'}
                        gridTemplateColumns={'1fr 1fr 1fr'}
                    >
                        <ContentColumn>
                            <ContentBlock title={'Customer ID'}>
                                {customer.user_id}
                            </ContentBlock>
                            <ContentBlock title={'Customer Email'}>
                                {customer.user_email}
                            </ContentBlock>
                        </ContentColumn>
                        <ContentColumn>
                            <ContentBlock title={'Customer Name'}>
                                {customer.user_firstname ?? 'N/A'} {customer.user_lastname ?? 'N/A'}
                            </ContentBlock>
                            <ContentBlock title={'Customer Phone'}>
                                {customer.user_phone}
                            </ContentBlock>
                        </ContentColumn>
                        <ContentColumn>
                            <ContentBlock title={'Customer Address'}>
                                {customer.user_address ?? 'N/A'}
                            </ContentBlock>
                            <ContentBlock title={'Is verified'}>
                                {customer.user_is_verified ? 'Yes' : 'No'}
                            </ContentBlock>
                        </ContentColumn>
                    </ContentRow>
                    <Box
                        mt={3}
                    >
                        <Typography
                            textAlign={'center'}
                            variant={'h3'}
                            mb={2}
                        >
                            Orders
                        </Typography>
                        <TableContainer>
                            {
                                customer.orders.length > 0 ?
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Order ID</TableCell>
                                                <TableCell>Order Date</TableCell>
                                                <TableCell>Order Status</TableCell>
                                                <TableCell>Order Total</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {customer.orders.map((order) => (
                                                <TableRow key={order.order_id}>
                                                    <TableCell>{order.order_id}</TableCell>
                                                    <TableCell>{order.order_created_at}</TableCell>
                                                    <TableCell>{order.order_status}</TableCell>
                                                    <TableCell>{order.order_price}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                    :
                                    <Typography
                                        textAlign={'center'}
                                        variant={'h4'}
                                    >
                                        No orders found
                                    </Typography>
                            }
                        </TableContainer>
                    </Box>
                    <Box
                        mt={3}

                    >
                        <Typography
                            textAlign={'center'}
                            variant={'h3'}
                            mb={2}
                        >
                            Deliveries
                        </Typography>
                        <TableContainer>
                            {
                                customer.deliveries.length > 0 ?
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Delivery ID</TableCell>
                                                <TableCell>Delivery Date</TableCell>
                                                <TableCell>Delivery Status</TableCell>
                                                <TableCell>Delivery Total</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {customer.deliveries.map((delivery) => (
                                                <TableRow key={delivery.delivery_id}>
                                                    <TableCell>{delivery.delivery_id}</TableCell>
                                                    <TableCell>{delivery.delivery_created_at}</TableCell>
                                                    <TableCell>{delivery.delivery_status}</TableCell>
                                                    <TableCell>{delivery.delivery_price}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                    :
                                    <Typography
                                        textAlign={'center'}
                                        variant={'h4'}
                                    >
                                        No deliveries found
                                    </Typography>
                            }
                        </TableContainer>
                    </Box>
                    <Box
                        mt={3}
                    >
                        <Typography
                            textAlign={'center'}
                            variant={'h3'}
                            mb={2}
                        >
                            Payments
                        </Typography>
                        <TableContainer>
                            {
                                customer.payments.length > 0 ?
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Payment ID</TableCell>
                                                <TableCell>Payment Date</TableCell>
                                                <TableCell>Payment Type</TableCell>
                                                <TableCell>Order ID</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {customer.payments.map((payment) => (
                                                <TableRow key={payment.payment_id}>
                                                    <TableCell>{payment.payment_id}</TableCell>
                                                    <TableCell>{payment.payment_date}</TableCell>
                                                    <TableCell>{payment.payment_type}</TableCell>
                                                    <TableCell>{payment.payment_order_id}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                    :
                                    <Typography
                                        textAlign={'center'}
                                        variant={'h4'}
                                    >
                                        No payments found
                                    </Typography>
                            }
                        </TableContainer>
                    </Box>
                </Container>
            </Box>
        </Page>
    );
};

export const getServerSideProps = withServerSideProps<CustomerPageProps>(async (context) => {
    const customerId = validateQueryParam(context.params?.customerId, 'number');
    if (!customerId) {
        return {
            notFound: true,
        };
    }

    const { code, data, ok } = await getSingleCustomer(customerId, context);

    if (ok === false || data === null) {
        throw new ServerError(code, 'Error fetching customer');
    }

    return {
        props: {
            customer: data,
        },
    };
});

interface CustomerPageProps {
    customer: GetSingleCustomerResponse;
}

export default withLayout(CustomerPage);