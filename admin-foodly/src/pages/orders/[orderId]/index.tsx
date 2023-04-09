import { getSingleOrder } from '@/api/orders/get-single-order.api';
import { ContentBlock } from '@/components/ui/ContentBlock';
import { ContentColumn } from '@/components/ui/ContentColumn';
import { ContentRow } from '@/components/ui/ContentRow';
import { ContentText } from '@/components/ui/ContentText';
import { Page } from '@/components/utility/Page';
import { ServerError } from '@/config/exceptions.config';
import type { Order } from '@/interfaces/order.interface';
import { Time } from '@/utils/dayjs.util';
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
import { BackendImage } from '@/components/utility/BackendImage';
import { Fragment } from 'react';

const OrderPage: NextPage<OrderPageProps> = ({ order }) => {
    return (
        <Page title={`Viewing order #${order.order_id}`}>
            <Box
                component="section"
                py={3}
            >
                <Container>
                    <Typography
                        variant="h2"
                        component="h2"
                        textAlign={'center'}
                        fontWeight={'bold'}
                        mb={3}
                    >
                        Viewing order
                    </Typography>
                    <ContentRow
                        display={'grid'}
                        gridTemplateColumns={'1fr 1fr 1fr'}
                        gridAutoColumns={'1fr'}
                        justifyItems={'center'}
                    >
                        <ContentColumn>
                            <ContentBlock title='Order ID'>
                                <ContentText>
                                    {order.order_id}
                                </ContentText>
                            </ContentBlock>
                            <ContentBlock title='Order Date'>
                                <ContentText>
                                    {Time(order.order_created_at).format('DD/MM/YYYY')}
                                </ContentText>
                            </ContentBlock>
                        </ContentColumn>
                        <ContentColumn>
                            <ContentBlock title='Total Price'>
                                <ContentText>
                                    {order.order_price}
                                </ContentText>
                            </ContentBlock>
                            <ContentBlock title='Order Status'>
                                <ContentText>
                                    {order.order_status[0] + order.order_status.slice(1).toLowerCase()}
                                </ContentText>
                            </ContentBlock>
                        </ContentColumn>
                        <ContentColumn>
                            <ContentBlock title='Customer'>
                                <ContentText>
                                    {order.user.user_firstname} {order.user.user_lastname}
                                </ContentText>
                            </ContentBlock>
                            <ContentBlock title={'Customer Phone'}>
                                <ContentText>
                                    {order.user.user_phone ?? 'No phone number provided'}
                                </ContentText>
                            </ContentBlock>
                        </ContentColumn>

                        {/* <Typography
                            variant="h4"
                            component="h3"
                        >
                            Order ID: {order.order_id}
                        </Typography>
                        <Typography
                            variant="h4"
                            component="h3"
                        >
                            Customer: {order.user.user_firstname} {order.user.user_lastname}
                        </Typography>
                        <Typography
                            variant="h4"
                            component="h3"
                        >
                            Order Date: {Time(order.order_created_at).format('DD/MM/YYYY')}
                        </Typography>
                        <Typography
                            variant="h4"
                            component="h3"
                        >
                            Total: {order.order_price}
                        </Typography>
                        <Typography>
                            Order Status: {order.order_status}
                        </Typography> */}
                    </ContentRow>
                    <Typography
                        mt={5}
                        variant="h3"
                        component="h3"
                        textAlign={'center'}
                        fontWeight={'bold'}
                    >
                        Order Products
                    </Typography>
                    <TableContainer
                        sx={{
                            mt: 3
                        }}
                    >
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Product ID</TableCell>
                                    <TableCell>Product Image</TableCell>
                                    <TableCell>Product Name</TableCell>
                                    <TableCell>Product Price</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {order.products.map((product) => (
                                    <TableRow key={product.product_id}>
                                        <TableCell>{product.product_id}</TableCell>
                                        <TableCell>
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
                                        <TableCell>{product.product_name}</TableCell>
                                        <TableCell>{product.product_price}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Typography
                        mt={5}
                        variant="h3"
                        component="h3"
                        textAlign={'center'}
                        fontWeight={'bold'}
                    >
                        Delivery
                    </Typography>
                    <Box>
                        {
                            order.delivery !== null
                                ? (
                                    <Fragment>
                                        <ContentRow
                                            display={'grid'}
                                            gridTemplateColumns={'1fr 1fr 1fr 1fr'}
                                            justifyItems={'center'}
                                        >
                                            <ContentColumn>
                                                <ContentBlock title='Delivery ID'>
                                                    <ContentText>
                                                        {order.delivery.delivery_id}
                                                    </ContentText>
                                                </ContentBlock>
                                                <ContentBlock title='Delivery Placed'>
                                                    <ContentText>
                                                        {Time(order.delivery.delivery_created_at).format('DD/MM/YYYY')}
                                                    </ContentText>
                                                </ContentBlock>
                                            </ContentColumn>
                                            <ContentColumn>
                                                <ContentBlock title='Delivery Status'>
                                                    <ContentText>
                                                        {order.delivery.delivery_status[0] + order.delivery.delivery_status.slice(1).toLowerCase()}
                                                    </ContentText>
                                                </ContentBlock>
                                                <ContentBlock title='Delivery Price'>
                                                    <ContentText>
                                                        {order.delivery.delivery_price}
                                                    </ContentText>
                                                </ContentBlock>
                                            </ContentColumn>
                                            <ContentColumn>
                                                <ContentBlock title='Delivery Address'>
                                                    <ContentText>
                                                        {order.delivery.delivery_address}
                                                    </ContentText>
                                                </ContentBlock>
                                                <ContentBlock title='Delivery Performed'>
                                                    <ContentText>
                                                        {order.delivery.delivery_finished_at ? Time(order.delivery.delivery_finished_at).format('DD/MM/YYYY') : 'Not finished'}
                                                    </ContentText>
                                                </ContentBlock>
                                            </ContentColumn>
                                            <ContentColumn>
                                                <ContentBlock title='Delivery Boy'>
                                                    <ContentText>
                                                        {order.delivery.delivery_boy ? `${order.delivery.delivery_boy.user_firstname} ${order.delivery.delivery_boy.user_lastname}` : 'No courier assigned'}
                                                    </ContentText>
                                                </ContentBlock>
                                                <ContentBlock title={'Delivery contact'}>
                                                    <ContentText>
                                                        {order.delivery.delivery_boy ? order.delivery.delivery_boy.user_phone : 'No courier assigned'}
                                                    </ContentText>
                                                </ContentBlock>
                                            </ContentColumn>
                                        </ContentRow>
                                    </Fragment>
                                )
                                :
                                <Typography
                                    mt={2}
                                    variant="h4"
                                    component="h4"
                                    textAlign={'center'}
                                >
                                    No delivery assigned
                                </Typography>
                        }
                    </Box>
                    <Typography
                        mt={5}
                        variant="h3"
                        component="h3"
                        textAlign={'center'}
                        fontWeight={'bold'}
                    >
                        Payment
                    </Typography>
                    <Box
                        mt={2}
                    >
                        {
                            order.payment !== null
                                ? (
                                    <Fragment>
                                        <ContentRow
                                            display={'grid'}
                                            gridTemplateColumns={'1fr 1fr 1fr'}
                                            justifyContent={'center'}
                                            alignContent={'center'}
                                        >
                                            <ContentColumn>
                                                <ContentBlock title='Payment ID'>
                                                    <ContentText>
                                                        {order.payment.payment_id}
                                                    </ContentText>
                                                </ContentBlock>
                                                <ContentBlock title='Payment Placed'>
                                                    <ContentText>
                                                        {Time(order.payment.payment_date).format('DD/MM/YYYY')}
                                                    </ContentText>
                                                </ContentBlock>
                                            </ContentColumn>
                                            <ContentColumn>
                                                <ContentBlock title='Payment Status'>
                                                    <ContentText>
                                                        {order.payment.payment_type[0] + order.payment.payment_type.slice(1).toLowerCase()}
                                                    </ContentText>
                                                </ContentBlock>
                                                <ContentBlock title='Payment Creator'>
                                                    <ContentText>
                                                        {order.user.user_firstname} {order.user.user_lastname}
                                                    </ContentText>
                                                </ContentBlock>
                                            </ContentColumn>
                                        </ContentRow>
                                    </Fragment>
                                )
                                :
                                <Typography
                                    mt={2}
                                    variant="h4"
                                    component="h4"
                                    textAlign={'center'}
                                >
                                    No payment assigned
                                </Typography>
                        }
                    </Box>
                </Container>
            </Box>
        </Page>
    );
};

export const getServerSideProps = withServerSideProps<OrderPageProps>(async (context) => {
    const orderId = validateQueryParam(context.params?.orderId, 'string');
    if (!orderId) {
        return {
            notFound: true
        };
    }

    const { code, data: order, ok } = await getSingleOrder(orderId, context);

    if (ok === false || order === null) {
        throw new ServerError(code, 'Failed to fetch order');
    }

    return {
        props: {
            order,
        }
    };
});

interface OrderPageProps {
    order: Order;
}

export default withLayout(OrderPage);